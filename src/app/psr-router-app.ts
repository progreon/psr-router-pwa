'use strict';

// JS Imports
// import { GetGame } from 'SharedModules/psr-router-game-factory';
// import * as Util from 'SharedModules/psr-router-util';
// import * as Route from 'SharedModules/psr-router-route';
import * as RouteUtil from 'SharedModules/psr-router-route/util';
// import { RouteFactory } from 'SharedModules/psr-router-route/util';
import { Route } from './shared/modules/psr-router-route';
import { PsrRouterPage } from './core/components/psr-router-page/psr-router-page';
import { PaperToastElement } from '@polymer/paper-toast';
import { PwaMenuItem } from './core/components/pwa/PwaMenuItem';
import { PwaPage } from './core/components/pwa/PwaPage';

// Imports for polymer/pwa
import { LitElement, html, css, property, TemplateResult, CSSResult, unsafeCSS } from 'lit-element';
import { render } from 'lit-html';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';
import { connect } from 'pwa-helpers/connect-mixin';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query';
import { installOfflineWatcher } from 'pwa-helpers/network';
import { installRouter } from './custom-router';
import { updateMetadata } from 'pwa-helpers/metadata';
import { Dialog } from '@material/mwc-dialog';

// Imports for this element
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-switch';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/paper-toast';
import 'CoreComponents/pwa/pwa-menu-bar';
import 'CoreComponents/pwa/pwa-menu-drawer';

// Image imports for this element
import { barsIcon, angleLeftIcon } from 'Shared/my-icons';
import PSRRIcon from 'Images/icon.png';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// This element is connected to the Redux store.
import { store } from 'Core/store';

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState,
  updateLayout
} from 'CoreActions/app';

export class PsrRouterApp extends connect(store)(LitElement) {

  @property({type: String})
  public appTitle: string;
  @property({type: Array})
  private _menuItems: PwaMenuItem[] = [];
  @property({type: Array})
  private _pageDOMs: HTMLElement[];
  @property({type: Object})
  private _currentRoute: Route;
  @property({type: Boolean})
  private _drawerOpened: boolean;
  @property({type: Boolean})
  private _offline: boolean;
  @property({type: String})
  private _page: string;
  @property({type: Object})
  private _searchParams: { [key: string]: string; };
  @property({type: Boolean})
  private _snackbarOpened: boolean;
  @property({type: Object})
  private _toastHtml: any;
  @property({type: Boolean})
  private _wideLayout: boolean;
  @property({type: String, reflect: true})
  private theme: string;

  static get styles() {
    return [
      AppStyles,
      css`
      :host {
        color: var(--app-dark-text-color);

        /* SIZES */
        --app-drawer-width: 256px;
        --app-wide-content-width: 1000px;
        --app-header-height: var(--app-grid-7x);
        --app-header-height-wide: var(--app-grid-7x);
        /* --app-header-margin-wide: 24px 15px 32px 15px; */
        --app-header-margin-wide: 0px 15px;
        --app-footer-height: var(--app-grid-3x);
      }

      .header-layout {
        background-color: var(--app-background-color);
        height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .drawer {
        color: var(--app-drawer-text-color);
        z-index: 1;
      }

      .drawer-top {
        color: var(--app-drawer-header-text-color);
        background-color: var(--app-drawer-header-background-color);
        height: var(--app-header-height);
      }

      .drawer-list {
        box-sizing: border-box;
        background-color: var(--app-drawer-background-color);
        width: 100%;
        height: 100%;
        padding: 24px;
        position: relative;
      }

      .drawer-list > a {
        display: block;
        color: var(--app-drawer-text-color);
        text-decoration: none;
        line-height: 40px;
        padding: 0 24px;
      }

      .drawer-list > a[selected] {
        color: var(--app-drawer-selected-color);
        /* border-bottom: 1px solid var(--app-drawer-selected-color); */
        font-weight: bold;
      }

      .toolbar {
        color: var(--app-header-text-color);
        background-color: var(--app-header-background-color);
        z-index: 0;
      }

      .toolbar-top {
        /* Need to set to 20px to avoid the swipe-open-area */
        padding: 0px 20px;
        height: var(--app-header-height);
      }

      .toolbar-top-content {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
      }

      .toolbar-top-content > .space {
        flex-grow: 1;
      }

      mwc-switch {
        margin-right: 10px;
        --mdc-theme-surface: var(--app-color-yellow);
        --mdc-theme-on-surface: var(--app-color-yellow);
        --mdc-theme-secondary: var(--app-color-blue);
      }

      .menu-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0px;
        fill: var(--app-header-text-color);
        height: var(--app-grid-2hx);
        width: var(--app-grid-2hx);
      }

      .menu-btn > svg {
        height: var(--app-grid-2hx);
        width: var(--app-grid-2hx);
      }

      .logo-icon {
        margin: 0px 0px 0px var(--app-grid-2hx);
        width: var(--app-grid-5x);
        height: var(--app-grid-5x);
      }

      .title {
        padding: 0px 0px 0px var(--app-grid-2hx);
      }

      .toolbar-navbar {
        display: none;
        background-color: var(--app-header-menu-background-color);
        overflow-x: hidden;
      }

      .toolbar-list {
        display: flex;
        width: var(--app-wide-content-width);
        /* padding: 0px var(--app-grid-3x); */
        background-color: var(--app-header-menu-background-color);
      }

      /* Workaround for IE11 displaying <main> as inline */
      main {
        display: block;
        background-color: var(--app-main-background-color);
        flex-grow: 1;
      }

      .main-content {
        height: 100%;
        overflow: auto;
        overflow-y: scroll;
      }

      .page {
        overflow: auto;
        display: none;
        padding: 0px var(--app-grid-3x);
        width: 100%;
        height: 100%;
      }

      .page.full-size {
        padding: 0px;
      }

      .page[active] {
        display: block;
      }

      /* .footer {
        display: block;
        padding: 0px;
        margin: 0px;
        width: 100%;
        height: var(--app-footer-height);
        background: var(--app-footer-background-color);
        color: var(--app-footer-text-color);
        text-align: center;
      } */

      paper-toast {
        width: 100%;
      }

      #tooltip {
        position: absolute;
        z-index: 1;
        border-radius: 10px;
        padding: 10px;
        background: var(--app-background-color);
        display: none;
        box-shadow: 0px 0px 10px black;
        max-height: 66.67%;
        overflow-y: auto;
      }

      /* Wide layout: when the viewport width is bigger than 640px, layout
      changes to a wide layout. */
      @media (min-width: ${unsafeCSS(window.MyAppGlobals.wideWidth)}) {
        .toolbar {
          z-index: 1;
        }

        .toolbar-top {
          height: auto;
          padding: 0px;
          justify-content: center;
        }

        .toolbar-top-content {
          height: var(--app-header-height-wide);
          width: var(--app-wide-content-width);
          margin: var(--app-header-margin-wide);
          /* padding: 0px var(--app-grid-3x); */
        }

        /* Uncomment this if you want the toolbar links to be visible when in wide view */
        .toolbar-navbar {
          display: flex;
          justify-content: center;
        }

        .menu-btn {
          display: none;
        }

        .main-content {
          padding: 0px;
          display: flex;
          justify-content: center;
        }

        .page {
          overflow: visible;
          width: var(--app-wide-content-width);
          padding: 0px var(--app-grid-2x);
        }

        .page.full-size {
          width: 100%;
        }

        .footer {
          display: none;
        }

        paper-toast {
          width: auto;
          /* width: 375px;
          max-width: 100%; */
        }
      }
    `
    ];
  }

  render() {
    let menuIcon = (window.appConfig.pageList[this._page]?.showInMenu || window.appConfig.pageList[this._page]?.is404) ? barsIcon : angleLeftIcon; // Default to back-arrow
    // Creating the menu items
    this._menuItems = this._getMenuItems(window.appConfig.siteMap);
    // Set page attributes/properties
    this._pageDOMs.forEach(pageDOM => {
      if (pageDOM instanceof PsrRouterPage) {
        let page = <PsrRouterPage>pageDOM;
        page.active = pageDOM.getAttribute('id') === this._page;
        page.app = this;
      }
    });
    const template = html`
      <!-- Drawer content -->
      <!-- Add swipe-open if you want the ability to swipe open the drawer -->
      <app-drawer slot="drawer" class="drawer" ?swipe-open="${!this._wideLayout}" ?opened="${this._drawerOpened}" @opened-changed="${e => store.dispatch(updateDrawerState(e.target.opened))}">
        <app-toolbar class="drawer-top">Menu</app-toolbar>
        <nav class="drawer-list">
          <pwa-menu-drawer class="menu" .menuItems="${this._menuItems}" .selectedItem="${this._page}"></pwa-menu-drawer>
        </nav>
      </app-drawer>

      <!-- Header content -->
      <div class="header-layout">
        <app-header slot="header" class="toolbar" fixed effects="waterfall">
          <app-toolbar class="toolbar-top" sticky>
            <div class="toolbar-top-content">
              <button class="menu-btn" title="Menu" @click="${() => this._onMenuButtonClicked(menuIcon === angleLeftIcon)}">${menuIcon}</button>
              <img class="logo-icon" src="${PSRRIcon}">
              <div class="title">${this.appTitle}</div>
              <div class="space"></div>
              <mwc-switch id="sw-theme" @change="${this._switchTheme}" ?checked="${this.theme == "dark"}"></mwc-switch>
            </div>
          </app-toolbar>

          <!-- This gets hidden on a small screen-->
          <div class="toolbar-navbar">
            <nav class="toolbar-list">
              <pwa-menu-bar class="menu" .menuItems="${this._menuItems}" .selectedItem="${this._page}"></pwa-menu-bar>
            </nav>
          </div>
        </app-header>

        <!-- Main content -->
        <main id="main" role="main" class="main-content">
          ${this._pageDOMs}
        </main>

        <!-- <footer class="footer">
        </footer> -->
      </div>

      <paper-toast id="toast" duration="10000">${this._toastHtml}</paper-toast>
      <mwc-dialog id="mwc-dialog" @closed="${this._mwcDialogClosed.bind(this)}"></mwc-dialog>
      <div id="tooltip"></div>
    `;
    return template;
  }

  get searchParams() {
    return this._searchParams;
  }

  get isDevMode(): boolean {
    return !!sessionStorage.getItem('dev');
  }

  constructor() {
    super();
    // Setting the list of pages
    // Copy here..
    this._pageDOMs = [];
    Object.values(window.appConfig.pageList).forEach(p => {
      if (p.element) {
        let pageDOM: HTMLElement = document.createElement(p.element);
        pageDOM.setAttribute('id', p.key);
        pageDOM.classList.add('page');
        if (p.fullSize){
          pageDOM.classList.add('full-size');
        }
        this._pageDOMs.push(pageDOM);
      }
    });

    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);

    this.theme = window.localStorage.getItem("app-theme");
    if (!this.theme) {
      window.localStorage.setItem("app-theme", this.theme = "light");
    }

    if (!window.isMobileView) {
      window.isMobileView = () => document.body.getBoundingClientRect().width < window.MyAppGlobals.wideWidth;
    }
    if (!window.openMwcDialog) {
      window.openMwcDialog = this._openMwcDialog.bind(this);
    }
    if (!window.showTooltip) {
      window.showTooltip = this._showTooltip.bind(this);
    }
  }

  firstUpdated(changedProperties) {
    // listen to the service worker promise in main.js to see if there has been a new update.
    window['isUpdateAvailable'].then(isAvailable => {
      if (isAvailable) {
        console.log("New Update Available! Reload the web app to get the latest juicy changes. (Oh Yeah!)");
        this.showToast(html`<div style="display: flex; justify-content: space-between; align-items: center;">New Update Available!<mwc-button @click="${() => window.location.reload()}">Reload</mwc-button></div>`);
      }
    });
    window.addEventListener('beforeunload', RouteUtil.RouteManager.SetCurrentRouteAsLastRoute);
    installRouter((location, e) => {store.dispatch(navigate(location, e))}, this._getScroll.bind(this), this._setScroll.bind(this));
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: ${window.MyAppGlobals.wideWidth})`,
        (matches) => store.dispatch(updateLayout(matches)));
  }

  updated(changedProperties) {
    try {
      this._currentRoute = RouteUtil.RouteManager.GetCurrentRoute();
    } catch (e) {
      console.error(e);
      window.alert("Unable to get the current route, see console for more details.");
    }

    if (this._page && (window.appConfig.pageList[this._page]?.needsRouteLoaded && !this._currentRoute)) {
      this.navigateTo("home");
    }

    let title = window.appConfig.pageList[this._page] ? window.appConfig.pageList[this._page].title : "Where Am I?";
    const pageTitle = this.appTitle + ' - ' + title;
    updateMetadata({
      title: pageTitle,
      description: pageTitle
      // This object also takes an image property, that points to an img src.
    });
  }

  navigateTo(href: string, isExternalLink: boolean = false): void {
    const navigateEvent = new CustomEvent('navigate', { detail: {href: href, external: isExternalLink}});
    document.body.dispatchEvent(navigateEvent);
  }

  _getMenuItems(pages) {
    return pages ? pages.filter(page => this._showInMenu(page)).map(page => new PwaMenuItem(page.key, page.title, !!page.element, this._getMenuItems(page.subPages))) : [];
  }

  _showInMenu(page: PwaPage) {
    if (page.element) {
      return page.showInMenu && (!page.needsRouteLoaded || !!this._currentRoute);
    } else {
      let showInMenu = false;
      page.subPages.forEach(sp => showInMenu ||= this._showInMenu(sp));
      return showInMenu;
    }
  }

  _switchTheme(e) {
    let swTheme: any = this.shadowRoot.getElementById("sw-theme");
    let theme = swTheme.checked ? "dark" : "light";
    window.localStorage.setItem("app-theme", theme);
    this.theme = theme;
    this.requestUpdate();
  }

  _getScroll() {
    return this.shadowRoot.getElementById("main").scrollTop;
  }

  _setScroll(scroll=0) {
    this.shadowRoot.getElementById("main").scrollTop = scroll;
  }

  _onMenuButtonClicked(isBackButton) {
    if (!isBackButton)
      store.dispatch(updateDrawerState(true));
    else
      window.history.back();
  }

  showToast(toastHtml) {
    let toast = <PaperToastElement>this.shadowRoot.getElementById('toast');
    toast.hide();
    this._toastHtml = toastHtml;
    toast.open();
  }

  _stateChanged(state) {
    let triggerDataRefresh = false;
    if (this._page != state.app.page || this._searchParams != state.app.searchParams) {
      triggerDataRefresh = true;
    }
    this._page = state.app.page;
    this._offline = state.app.offline;
    this._searchParams = state.app.searchParams;
    if (state.app.searchParams?.dev) {
      if (state.app.searchParams.dev == "0") {
        sessionStorage.removeItem('dev');
      } else {
        sessionStorage.setItem('dev', 'true');
      }
    }
    this._snackbarOpened = state.app.snackbarOpened;
    this._wideLayout = state.app.wideLayout;
    this._drawerOpened = state.app.drawerOpened;
    if (triggerDataRefresh) {
      if ((<PsrRouterPage>this.shadowRoot.getElementById(this._page))?.triggerDataRefresh) {
        (<PsrRouterPage>this.shadowRoot.getElementById(this._page)).triggerDataRefresh();
      }
      if (document.getElementById("overlay")) {
        (<any>document.getElementById("overlay")).close();
      }
      if (document.getElementById("dialog")) {
        (<any>document.getElementById("dialog")).close();
      }
      window.setTimeout(this._setScroll.bind(this, window.history.state && window.history.state.scroll), 20);
    }
  }

  _renderMwcDialog(template: TemplateResult): Dialog {
    let dialog: Dialog = <Dialog>this.shadowRoot.getElementById("mwc-dialog");
    render(template, dialog);
    return dialog;
  }

  _openMwcDialog(template: TemplateResult, dialogAtt?: { [key: string]: boolean|string }): Dialog {
    let dialog: Dialog = this._renderMwcDialog(template);
    if (dialogAtt) {
      Object.keys(dialogAtt).forEach(k => {
        let v = dialogAtt[k];
        dialog[k] = v;
      });
    }
    dialog.show();
    return dialog;
  }

  _mwcDialogClosed(e: any) {
    e.cancelbubble = true;
    let dialog: Dialog = <Dialog>this.shadowRoot.getElementById("mwc-dialog");
    if (e.target == dialog) {
      this._renderMwcDialog(null);
    }
  }

  _hideTooltip(e) {
    let tooltip = this.shadowRoot.getElementById("tooltip");
    if (tooltip) {
      tooltip.style.display = "none";
      render(null, tooltip);
    }
  }
  private _tooltipHideListener = this._hideTooltip.bind(this);
  
  private _tooltipForElement = null;
  private async _showTooltip(template: TemplateResult, forElement: HTMLElement) {
    this._tooltipForElement = forElement;
    let r = forElement.getBoundingClientRect();
    let tooltip = this.shadowRoot.getElementById("tooltip");
    forElement.addEventListener("mouseleave", this._tooltipHideListener);
    tooltip.style.top = "0px";
    tooltip.style.left = "0px";
    tooltip.style.display = "block";
    tooltip.style.visibility = "hidden";
    render(template, tooltip);
    await this._sleep(250);
    if (this._tooltipForElement == forElement) {
      // only continue if we're still showing the tooltip for the same element!
      let r2 = tooltip.getBoundingClientRect();
      let body = document.body.getBoundingClientRect();
      let left = r.x + (r.width - r2.width) / 2;
      if (left + r2.width + 20 > body.width) {
        left = body.width - r2.width - 20;
      }
      if (left < 0) {
        left = 0;
      }
      tooltip.style.left = left + "px";
      if (r2.width > body.width) {
        tooltip.style.width = (body.width - 40) + "px";
        r2 = tooltip.getBoundingClientRect();
      }
      tooltip.style.top = (r.y - r.height / 2 - r2.height) + "px";
      tooltip.style.visibility = "visible";
    }
  }

  private _sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

window.customElements.define('psr-router-app', PsrRouterApp);
