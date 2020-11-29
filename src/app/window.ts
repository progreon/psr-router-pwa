import { TemplateResult } from 'lit-element';
import { PwaPage } from "./core/components/pwa/PwaPage";
import { DialogElement } from "@vaadin/vaadin-dialog";
import { Dialog } from '@material/mwc-dialog';

export { }

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
    app: any;
    appConfig: { app: string, siteMap: PwaPage[], pageList: { [key: string]: PwaPage } };
    MyAppGlobals: any;
    isUpdateAvailable: any;
    openVaadinDialog: (dialogRenderer: any) => DialogElement;
    openMwcDialog: (template: TemplateResult) => Dialog;
  }
}
