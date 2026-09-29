import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { storyAdminService } from './storyAdmin.service';
import {
  AdminStoryDetail,
  AdminStoryItem,
  missingImageOrders,
  RemoveStoryInput,
  StoryVisibility,
} from './types';

const PAGE_SIZE = 24;
/** Mientras se regeneran imágenes, el detalle se recarga cada tanto... */
const REGENERATION_POLL_MS = 10_000;
/** ...hasta que llegan todas o pasa este tiempo (5 intentos de 30 s + esperas). */
const REGENERATION_MAX_WAIT_MS = 200_000;
/** Espera tras la última tecla antes de buscar en el servidor. */
const SEARCH_DEBOUNCE_MS = 350;

export interface AdminStoriesFilters {
  search: string;
  /** Vacío = todas. */
  visibility: StoryVisibility | null;
}

/**
 * Lista paginada del panel de moderación. La búsqueda y el filtro se hacen en
 * el servidor (puede haber miles de historietas): al cambiar vuelve a la
 * primera página; la búsqueda espera a que el admin deje de escribir.
 */
export const useAdminStories = ({ search, visibility }: AdminStoriesFilters) => {
  const [items, setItems] = useState<AdminStoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  // Cada pedido lleva un número: si llega la respuesta de uno viejo (el admin
  // siguió escribiendo), se descarta.
  const requestId = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPage = useCallback(
    async (next: number) => {
      const id = ++requestId.current;
      if (next === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);
      try {
        const response = await storyAdminService.list({
          page: next,
          limit: PAGE_SIZE,
          visibility: visibility ?? undefined,
          search: debouncedSearch,
        });
        if (id !== requestId.current) return;
        if (!response.ok || !response.data) {
          setError(getErrorMessage(response.message, 'No se pudieron cargar las historietas'));
          return;
        }
        const { items: pageItems, total: pageTotal } = response.data;
        setItems((prev) => (next === 1 ? pageItems : [...prev, ...pageItems]));
        setTotal(pageTotal);
        setPage(next);
      } catch {
        if (id === requestId.current) setError('No se pudo conectar con el servidor');
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [debouncedSearch, visibility],
  );

  useEffect(() => {
    void fetchPage(1);
  }, [fetchPage]);

  const hasMore = items.length < total;
  const refresh = useCallback(() => fetchPage(1), [fetchPage]);
  const loadMore = useCallback(() => {
    if (hasMore && !loading && !loadingMore) void fetchPage(page + 1);
  }, [fetchPage, hasMore, loading, loadingMore, page]);

  return { items, total, loading, loadingMore, error, hasMore, refresh, loadMore };
};

/** Detalle de una historieta para el admin, con las acciones de quitarla y restaurarla. */
export const useAdminStoryDetail = (storyId: string) => {
  const [story, setStory] = useState<AdminStoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Quitando o restaurando.
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await storyAdminService.get(storyId);
      if (response.ok && response.data) setStory(response.data);
      else setError(getErrorMessage(response.message, 'No se pudo cargar la historieta'));
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Aplica una acción de moderación. Devuelve null si salió bien, o el mensaje de error. */
  const moderate = useCallback(
    async (
      action: () => ReturnType<typeof storyAdminService.get>,
      fallback: string,
    ): Promise<string | null> => {
      setUpdating(true);
      try {
        const response = await action();
        if (response.ok && response.data) {
          setStory(response.data);
          return null;
        }
        return getErrorMessage(response.message, fallback);
      } catch {
        return 'No se pudo conectar con el servidor';
      } finally {
        setUpdating(false);
      }
    },
    [],
  );

  const remove = useCallback(
    (input: RemoveStoryInput) =>
      moderate(() => storyAdminService.remove(storyId, input), 'No se pudo quitar la historieta'),
    [moderate, storyId],
  );

  const restore = useCallback(
    (note?: string) =>
      moderate(
        () => storyAdminService.restore(storyId, note),
        'No se pudo restaurar la historieta',
      ),
    [moderate, storyId],
  );

  // Regeneración de imágenes: qué viñetas se pidieron y desde cuándo.
  const [regenerating, setRegenerating] = useState<{ orders: number[]; since: number } | null>(
    null,
  );

  /** Pide volver a dibujar las imágenes que faltan. Devuelve null si salió bien, o el error. */
  const regenerateImages = useCallback(async (): Promise<string | null> => {
    try {
      const response = await storyAdminService.regenerateImages(storyId);
      if (!response.ok || !response.data) {
        return getErrorMessage(response.message, 'No se pudieron pedir las imágenes');
      }
      if (response.data.queued > 0) {
        setRegenerating({ orders: response.data.orders, since: Date.now() });
      }
      return null;
    } catch {
      return 'No se pudo conectar con el servidor';
    }
  }, [storyId]);

  // Mientras falte alguna de las pedidas, se recarga el detalle cada tanto.
  const stillMissing =
    story && regenerating
      ? regenerating.orders.filter((order) => missingImageOrders(story).includes(order))
      : [];
  const waiting = !!regenerating && stillMissing.length > 0;
  useEffect(() => {
    if (!regenerating) return;
    if (!waiting || Date.now() - regenerating.since > REGENERATION_MAX_WAIT_MS) {
      setRegenerating(null);
      return;
    }
    const timer = setTimeout(() => void load(), REGENERATION_POLL_MS);
    return () => clearTimeout(timer);
  }, [regenerating, waiting, story, load]);

  return {
    story,
    loading,
    error,
    updating,
    reload: load,
    remove,
    restore,
    regenerateImages,
    /** Viñetas que se están regenerando y todavía no tienen imagen. */
    regeneratingOrders: waiting ? stillMissing : [],
  };
};
