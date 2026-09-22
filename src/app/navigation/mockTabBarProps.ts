import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

/**
 * Arma un `BottomTabBarProps` mínimo pero válido para storiar TabBarMobile/
 * TabBarWeb en aislamiento — ambos componentes solo leen `state.routes`,
 * `state.index` y llaman `navigation.navigate`/`navigation.emit`, así que
 * no hace falta un NavigationContainer real de por medio.
 */
export const createMockTabBarProps = (
  routeNames: string[],
  focusedIndex: number = 0,
): BottomTabBarProps => {
  const routes = routeNames.map((name) => ({ key: `${name}-key`, name, params: undefined }));

  const descriptors = Object.fromEntries(
    routes.map((route) => [
      route.key,
      {
        options: { title: route.name },
        navigation: undefined,
        render: () => null,
      },
    ]),
  );

  return {
    state: {
      key: 'tab-mock',
      index: focusedIndex,
      routeNames,
      routes,
      type: 'tab',
      stale: false as const,
    },
    descriptors,
    navigation: {
      navigate: () => {},
      emit: () => ({ defaultPrevented: false }),
    },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
  } as unknown as BottomTabBarProps;
};
