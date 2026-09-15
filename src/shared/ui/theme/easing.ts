import { Easing } from 'react-native';


export const easing = {

    standard: Easing.out(Easing.cubic),


    accelerate: Easing.in(Easing.cubic),


    decelerate: Easing.out(Easing.quad),


    playful: Easing.out(Easing.back(1.5)),

    linear: Easing.linear,
} as const;