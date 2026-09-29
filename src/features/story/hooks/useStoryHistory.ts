import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { storyHistoryService } from '../services/storyHistory.service';
import { Level } from '@/shared/types/common';
import {
  StoredStoryManifest,
  StoryCatalogFilters,
  StoryHistoryItem,
  StoryListSource,
} from '../types';

const PAGE_SIZE = 20;
/** Espera tras la última tecla antes de buscar en el servidor. */
const SEARCH_DEBOUNCE_MS = 350;

/**
 * Lista paginada del historial o del catálogo: carga la primera página al
 * montar y cada vez que cambian los filtros (la búsqueda, cuando se deja de
 * escribir). Si llega la respuesta de un pedido viejo, se descarta.
 */
export const useStoryHistory = (
  source: StoryListSource = 'history',
  filters: StoryCatalogFilters = {},
) => {
  const [items, setItems] = useState<StoryHistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const [search, setSearch] = useState(filters.search ?? '');
  useEffect(() => {
    const timer = setTimeout(() => setSearch(filters.search ?? ''), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [filters.search]);
  // Clave estable de los niveles, para no volver a pedir con cada render.
  const levelsKey = (filters.levels ?? []).join(',');

  const fetchPage = useCallback(
    async (next: number) => {
      const id = ++requestId.current;
      if (next === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);
      try {
        const levels = levelsKey ? (levelsKey.split(',') as Level[]) : [];
        const response = await storyHistoryService.list(next, PAGE_SIZE, source, {
          search,
          levels,
        });
        if (id !== requestId.current) return;
        if (!response.ok || !response.data) {
          setError(getErrorMessage(response.message, 'Could not load the stories'));
          return;
        }
        const { items: pageItems, total: pageTotal } = response.data;
        setItems((prev) => (next === 1 ? pageItems : [...prev, ...pageItems]));
        setTotal(pageTotal);
        setPage(next);
      } catch {
        if (id === requestId.current) setError('Could not connect to the server');
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [source, search, levelsKey],
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

/**
 * Una historieta del historial o del catálogo (su manifiesto), con sus
 * reacciones y likes. Reaccionar y dar like se ven al instante y se guardan
 * en el servidor; si falla, se vuelve atrás y queda `actionError`.
 */
export const useStoryHistoryDetail = (
  storyId: string,
  source: StoryListSource = 'history',
  userId = '',
) => {
  const [manifest, setManifest] = useState<StoredStoryManifest | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await storyHistoryService.get(storyId, source);
      if (response.ok && response.data) setManifest(response.data);
      else setError(getErrorMessage(response.message, 'Could not load the story'));
    } catch {
      setError('Could not connect to the server');
    } finally {
      setLoading(false);
    }
  }, [storyId, source]);

  useEffect(() => {
    void load();
  }, [load]);

  // Siempre la versión actual, para calcular el cambio y poder deshacerlo.
  const manifestRef = useRef(manifest);
  manifestRef.current = manifest;

  const setPanelReactions = (order: number, reactions: Record<string, string>) =>
    setManifest((prev) =>
      prev
        ? {
            ...prev,
            panels: prev.panels.map((panel) =>
              panel.order === order ? { ...panel, reactions } : panel,
            ),
          }
        : prev,
    );

  /** Tocar la reacción que ya tenía la quita; otra la reemplaza. */
  const react = useCallback(
    async (order: number, emoji: string) => {
      const panel = manifestRef.current?.panels.find((item) => item.order === order);
      if (!panel || !userId) return;
      const previous = panel.reactions;
      const next = previous[userId] === emoji ? null : emoji;
      const optimistic = { ...previous };
      if (next) optimistic[userId] = next;
      else delete optimistic[userId];
      setActionError(null);
      setPanelReactions(order, optimistic);
      try {
        const response = await storyHistoryService.react(storyId, order, next);
        if (response.ok && response.data) {
          setPanelReactions(order, response.data.reactions);
          return;
        }
        setActionError(getErrorMessage(response.message, 'Could not save your reaction'));
      } catch {
        setActionError('Could not connect to the server');
      }
      setPanelReactions(order, previous);
    },
    [storyId, userId],
  );

  const setLikes = (likes: StoredStoryManifest['likes']) =>
    setManifest((prev) => (prev ? { ...prev, likes } : prev));

  const toggleLike = useCallback(async () => {
    const previous = manifestRef.current?.likes;
    if (!previous) return;
    const liked = !previous.likedByMe;
    setActionError(null);
    setLikes({ count: Math.max(previous.count + (liked ? 1 : -1), 0), likedByMe: liked });
    try {
      const response = await storyHistoryService.setLiked(storyId, liked);
      if (response.ok && response.data) {
        setLikes(response.data);
        return;
      }
      setActionError(getErrorMessage(response.message, 'Could not save your like'));
    } catch {
      setActionError('Could not connect to the server');
    }
    setLikes(previous);
  }, [storyId]);

  return { manifest, loading, error, reload: load, react, toggleLike, actionError };
};
