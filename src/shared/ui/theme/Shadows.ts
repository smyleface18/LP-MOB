import { Platform } from 'react-native';


/**
* RN handles shadows differently depending on the platform:
* - iOS/Web: shadowColor, shadowOffset, shadowOpacity, shadowRadius
* - Android: only "elevation"
* Therefore, each level defines both, and Platform.select chooses the correct one. 
*/

const makeShadow = (elevation: number, opacity: number, radius: number) =>
    Platform.select({
        android: { elevation },
        default: {
            shadowColor: '#18181B',
            shadowOffset: { width: 0, height: elevation / 2 },
            shadowOpacity: opacity,
            shadowRadius: radius,
        },
    });

export const shadow = {
    none: {},
    sm: makeShadow(2, 0.08, 4),
    md: makeShadow(4, 0.1, 8),
    lg: makeShadow(8, 0.14, 16),
} as const;