// phosphor-react-native pasa `className` a los <Svg> (usado por
// react-native-web para estilos CSS), pero ni `SvgProps` ni `IconProps`
// lo declaran. Solo aparece al importar íconos desde su subpath propio
// (`phosphor-react-native/src/icons/*`, ver icon-registry.ts) porque ahí
// TS chequea el .tsx fuente en vez del .d.ts compilado. Fix documentado en
// el README de la librería.
//
// El `export {}` de abajo es obligatorio: sin al menos un import/export en
// este archivo, TS lo trata como "global script" y los `declare module`
// de abajo SOBREESCRIBEN el módulo real en vez de agregarle campos (rompe
// todos los demás exports de react-native-svg/phosphor-react-native en el
// proyecto).
export {};

declare module 'react-native-svg' {
  interface SvgProps {
    className?: string;
  }
}

declare module 'phosphor-react-native' {
  interface IconProps {
    className?: string;
  }
}
