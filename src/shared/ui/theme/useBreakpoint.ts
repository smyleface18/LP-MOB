import { useWindowDimensions } from 'react-native';
import { breakpoints } from './breakpoints';

type BreakpointName = keyof typeof breakpoints;


export function useBreakpoint() {
    const { width } = useWindowDimensions();


    const breakpoint = (Object.entries(breakpoints) as [BreakpointName, number][])
        .sort((a, b) => b[1] - a[1])
        .find(([, minWidth]) => width >= minWidth)?.[0] ?? 'mobile';

    return {
        width,
        breakpoint,
        isMobile: breakpoint === 'mobile',
        isTablet: breakpoint === 'tablet' || breakpoint === 'desktop' || breakpoint === 'wide',
        isDesktop: breakpoint === 'desktop' || breakpoint === 'wide',
    };
}