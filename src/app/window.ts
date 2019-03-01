export {}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
    app: any;
    appConfig: any;
    MyAppGlobals: any;
    isUpdateAvailable: any;
  }
}
