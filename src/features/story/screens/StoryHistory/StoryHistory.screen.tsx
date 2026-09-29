import React, { useState } from 'react';
import { Level } from '@/shared/types/common';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { StoryListStackParamList } from '@/app/navigation/storyListRoutes';
import { useStoryHistory } from '../../hooks/useStoryHistory';
import StoryHistoryView from './StoryHistory.view';

/**
 * Historietas terminadas: las del jugador (desde su Perfil) o, con
 * `source: 'catalog'`, las de todos (tab Explorar), con búsqueda y filtro por nivel.
 */
const StoryHistoryScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<StoryListStackParamList>>();
  const { params } = useRoute<RouteProp<StoryListStackParamList, 'StoryHistory'>>();
  const source = params?.source ?? 'history';
  const [search, setSearch] = useState('');
  const [levels, setLevels] = useState<Level[]>([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const history = useStoryHistory(source, { search, levels });

  return (
    <StoryHistoryView
      items={history.items}
      total={history.total}
      loading={history.loading}
      loadingMore={history.loadingMore}
      error={history.error}
      onRefresh={() => void history.refresh()}
      onLoadMore={history.loadMore}
      source={source}
      filters={
        source === 'catalog'
          ? {
              search,
              onSearchChange: setSearch,
              levels,
              onToggleLevel: (level) =>
                setLevels((prev) =>
                  prev.includes(level) ? prev.filter((item) => item !== level) : [...prev, level],
                ),
              visible: filtersVisible,
              onToggleVisible: () => setFiltersVisible((prev) => !prev),
              onClear: () => {
                setSearch('');
                setLevels([]);
              },
            }
          : undefined
      }
      onOpen={(storyId) => navigation.navigate('StoryHistoryDetail', { storyId, source })}
      // En el tab Explorar el catálogo es la raíz: no hay a dónde volver.
      onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
    />
  );
};

export default StoryHistoryScreen;
