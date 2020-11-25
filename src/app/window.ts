import { PwaPage } from "./core/components/pwa/PwaPage";

export { }

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
    app: any;
    appConfig: { app: string, siteMap: PwaPage[], pageList: { [key: string]: PwaPage } };
    MyAppGlobals: any;
    isUpdateAvailable: any;
  }
}
