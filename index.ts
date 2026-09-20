// package.json apunta siempre a este archivo como "main" — no hay forma de que
// Metro cargue .rnstorybook/index.ts en su lugar sin este switch. Los imports
// estáticos se evalúan siempre (aunque estén en una rama nunca tomada), así que
// esto usa require() condicional a propósito: cada entrypoint llama a
// registerRootComponent() como efecto secundario al cargarse, y no queremos
// que se llame dos veces.
//
// Tiene que ser EXPO_PUBLIC_STORYBOOK_ENABLED (no STORYBOOK_ENABLED a secas):
// Expo solo inlinea en el bundle del cliente las env vars con prefijo
// EXPO_PUBLIC_ — cualquier otra queda seteada nada más en el proceso de Node
// que corre `expo start` en la PC y nunca llega al dispositivo.
if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === 'true') {
  require('./.rnstorybook');
} else {
  const { registerRootComponent } = require('expo');
  const App = require('./App').default;

  // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
  // It also ensures that whether you load the app in Expo Go or in a native build,
  // the environment is set up appropriately
  registerRootComponent(App);
}
