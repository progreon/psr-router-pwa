'use strict';

// JS Imports
import { GetGame } from 'SharedModules/psr-router-data';
import * as Util from 'SharedModules/psr-router-util';
import * as Route from 'SharedModules/psr-router-route';
import * as RouteUtil from 'SharedModules/psr-router-route/util';
import { RouteFactory } from 'SharedModules/psr-router-route/util';

// Imports for polymer/pwa
import { LitElement, html } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';
import { connect } from 'pwa-helpers/connect-mixin';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query';
import { installOfflineWatcher } from 'pwa-helpers/network';
import { installRouter } from './custom-router';
import { updateMetadata } from 'pwa-helpers/metadata';

// Imports for this element
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/paper-toast';
import '@vaadin/vaadin-button/theme/material/vaadin-button';
import 'CoreComponents/snack-bar/snack-bar';

// Image imports for this element
import { barsIcon, angleLeftIcon } from 'Shared/my-icons';
import PSRRIcon from 'Images/icon.png';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// This element is connected to the Redux store.
import { store } from 'Core/store.js';

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState,
  updateLayout
} from 'CoreActions/app.js';

class PsrRouterApp extends connect(store)(LitElement) {
  render() {
    var linkList = [];
    let pageList = window.appConfig.pageList;
    var menuIcon = pageList[this._page] && (pageList[this._page].showInMenu || pageList[this._page].is404) ? barsIcon : angleLeftIcon; // Default to back-arrow
    for (var [page, info] of Object.entries(pageList)) {
      if (info.showInMenu) {
        const a = html`<a ?selected="${this._page === page}" href="/${page}">${info.title}</a>`;
        linkList.push(a);
      }
    }
    const template = html`
      ${AppStyles}
      <style>
        :host {
          /* COLORS */
          --app-profile-color: var(--app-color-grass);
          --app-profile-color-light: var(--app-color-grass-light);

          --app-primary-color: var(--app-color-white);
          --app-secondary-color: var(--app-color-black);
          --app-dark-text-color: var(--app-secondary-color);
          --app-light-text-color: var(--app-color-white);

          --app-header-background-color: var(--app-color-blue);
          --app-header-text-color: var(--app-light-text-color);

          --app-header-menu-background-color: var(--app-color-yellow);
          --app-header-menu-text-color: var(--app-dark-text-color);
          --app-header-menu-selected-color: var(--app-dark-text-color);

          --app-drawer-background-color: var(--app-color-yellow);
          --app-drawer-text-color: var(--app-dark-text-color);
          --app-drawer-selected-color: var(--app-dark-text-color);

          --app-drawer-header-background-color: var(--app-color-blue);
          --app-drawer-header-text-color: var(--app-light-text-color);

          --app-footer-text-color: var(--app-color-white);
          --app-footer-background-color: var(--app-color-blue);

          --app-background-color: var(--app-color-white);
          --app-main-background-color: var(--app-color-white);

          color: var(--app-dark-text-color);

          /* DARK MODE */
          /* --app-header-background-color: var(--app-color-black);
          --app-header-text-color: var(--app-color-yellow);
          --app-header-menu-background-color: var(--app-color-black);
          --app-header-menu-text-color: var(--app-color-blue);
          --app-header-menu-selected-color: var(--app-color-blue);
          --app-drawer-background-color: var(--app-color-black);
          --app-drawer-text-color: var(--app-color-blue);
          --app-drawer-selected-color: var(--app-color-blue);
          --app-drawer-header-background-color: var(--app-color-black);
          --app-drawer-header-text-color: var(--app-color-yellow);
          --app-footer-text-color: var(--app-color-yellow);
          --app-footer-background-color: var(--app-color-black);
          --app-background-color: var(--app-color-blue);
          --app-main-background-color: var(--app-color-blue); */

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

        .toolbar-list > a {
          display: inline-block;
          color: var(--app-header-menu-text-color);
          text-decoration: none;
          line-height: 30px;
          padding: 8px 24px;
        }

        .toolbar-list > a[selected] {
          color: var(--app-header-menu-selected-color);
          box-shadow: inset 0px -4px var(--app-header-menu-selected-color);
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

        .footer {
          display: block;
          padding: 0px;
          margin: 0px;
          width: 100%;
          height: var(--app-footer-height);
          background: var(--app-footer-background-color);
          color: var(--app-footer-text-color);
          text-align: center;
        }

        paper-toast {
          width: 100%;
        }

        /* Wide layout: when the viewport width is bigger than 640px, layout
        changes to a wide layout. */
        @media (min-width: ${MyAppGlobals.wideWidth}) {
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
      </style>

      <!-- Drawer content -->
      <!-- Add swipe-open if you want the ability to swipe open the drawer -->
      <app-drawer slot="drawer" class="drawer" ?swipe-open="${!this._wideLayout}" ?opened="${this._drawerOpened}" @opened-changed="${e => store.dispatch(updateDrawerState(e.target.opened))}">
        <app-toolbar class="drawer-top">Menu</app-toolbar>
        <nav class="drawer-list">
          ${linkList}
        </nav>
      </app-drawer>

      <!-- Header content -->
      <div class="header-layout">
        <app-header slot="header" class="toolbar" fixed effects="waterfall">
          <app-toolbar class="toolbar-top" sticky>
            <div class="toolbar-top-content">
              <button class="menu-btn" title="Menu" @click="${_ => this._onMenuButtonClicked(menuIcon === angleLeftIcon)}">${menuIcon}</button>
              <img class="logo-icon" src="${PSRRIcon}">
              <div class="title">${this.appTitle}</div>
            </div>
          </app-toolbar>

          <!-- This gets hidden on a small screen-->
          <div class="toolbar-navbar">
            <nav class="toolbar-list">
              ${linkList}
            </nav>
          </div>
        </app-header>

        <!-- Main content -->
        <main id="main" role="main" class="main-content">
          <psr-router-home id="home" class="page" ?active="${this._page === 'home'}" .app="${this}"></psr-router-home>
          <psr-router-router id="router" class="page" ?active="${this._page === 'router'}" .app="${this}"></psr-router-router>
          <psr-router-items id="items" class="page" ?active="${this._page === 'items'}" .app="${this}"></psr-router-items>
          <psr-router-moves id="moves" class="page" ?active="${this._page === 'moves'}" .app="${this}"></psr-router-moves>
          <psr-router-pokemon-info id="pokemon-info" class="page" ?active="${this._page === 'pokemon-info'}" .app="${this}"></psr-router-pokemon-info>
          <psr-router-pokemon-list id="pokemon-list" class="page" ?active="${this._page === 'pokemon-list'}" .app="${this}"></psr-router-pokemon-list>
          <psr-router-trainers id="trainers" class="page" ?active="${this._page === 'trainers'}" .app="${this}"></psr-router-trainers>
          <psr-router-trainer-info id="trainer-info" class="page" ?active="${this._page === 'trainer-info'}" .app="${this}"></psr-router-trainer-info>
          <psr-router-manual id="help" class="page" ?active="${this._page === 'help'}" .app="${this}"></psr-router-manual>
          <psr-router-about id="about" class="page" ?active="${this._page === 'about'}" .app="${this}"></psr-router-about>
          <psr-router-404 id="404" class="page" ?active="${this._page === '404'}" .app="${this}"></psr-router-404>

          <snack-bar ?active="${this._snackbarOpened}" ?offline="${this._offline}">
              You are now ${this._offline ? 'offline' : 'online'}.</snack-bar>
        </main>

        <footer class="footer">
          ${this.appTitle} v${MyAppGlobals.version}
          <!-- [TODO: shortcuts] -->
        </footer>
      </div>

      <paper-toast id="toast" duration="10000">${this._toastHtml}</paper-toast>
    `;
    return template;
  }

  static get properties() {
    return {
      appTitle: String,
      _currentGame: Object,
      _drawerOpened: Boolean,
      _exampleRoute: Object,
      _offline: Boolean,
      _page: String,
      _pageList: Object,
      _searchParams: Object,
      _snackbarOpened: Boolean,
      _toastHtml: Object,
      _wideLayout: Boolean
    };
  }

  get searchParams() {
    return this._searchParams;
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
    // Setting the list of pages
    window.appConfig.pageList = {
      'home': {title: "Home", element: 'psr-router-home', showInMenu: true},
      'router': {title: "Route", element: 'psr-router-router', showInMenu: true},
      'pokemon-list': {title: "Pokémon", element: 'psr-router-pokemon-list', showInMenu: true},
      'pokemon-info': {title: "Pokémon Info", element: 'psr-router-pokemon-info'},
      'trainers': {title: "Trainers", element: 'psr-router-trainers', showInMenu: true},
      'trainer-info': {title: "Trainer Info", element: 'psr-router-trainer-info'},
      'moves': {title: "Moves", element: 'psr-router-moves', showInMenu: true},
      'items': {title: "Items", element: 'psr-router-items', showInMenu: true},
      'help': {title: "Help", element: 'psr-router-manual', showInMenu: true},
      'about': {title: "About", element: 'psr-router-about', showInMenu: true},
      '404': {title: "404", element: 'psr-router-404', is404: true}
    }

    // Load the last saved (json) route from the local storage if there is one
    RouteUtil.RouteManager.LoadSavedRoute();

    var game = RouteUtil.RouteManager.GetCurrentGame();
    console.debug("Current game:", game);
  }

  firstUpdated(changedProperties) {
    // listen to the service worker promise in main.js to see if there has been a new update.
    window['isUpdateAvailable'].then(isAvailable => {
      if (isAvailable) {
        console.log("New Update Available! Reload the web app to get the latest juicy changes. (Oh Yeah!)");
        this.showToast(html`<div style="display: flex; justify-content: space-between; align-items: center;">New Update Available!<vaadin-button @click="${_ => window.location.reload(false)}" style="cursor: pointer;">Reload</vaadin-button></div>`);
      }
    });
    // window.onunload = e => RouteUtil.RouteManager.SaveRoute();
    installRouter((location, e) => {store.dispatch(navigate(location, e))}, this._getScroll.bind(this), this._setScroll.bind(this));
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: ${MyAppGlobals.wideWidth})`,
        (matches) => store.dispatch(updateLayout(matches)));
  }

  updated(changedProperties) {
    var title = window.appConfig.pageList[this._page] ? window.appConfig.pageList[this._page].title : "Where Am I?";
    const pageTitle = this.appTitle + ' - ' + title;
    updateMetadata({
      title: pageTitle,
      description: pageTitle
      // This object also takes an image property, that points to an img src.
    });
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
    var toast = this.shadowRoot.getElementById('toast');
    toast.hide();
    this._toastHtml = toastHtml;
    toast.open();
  }

  _stateChanged(state) {
    var triggerDataRefresh = false;
    if (this._page != state.app.page || this._searchParams != state.app.searchParams) {
      triggerDataRefresh = true;
    }
    this._page = state.app.page;
    this._offline = state.app.offline;
    this._searchParams = state.app.searchParams;
    this._snackbarOpened = state.app.snackbarOpened;
    this._wideLayout = state.app.wideLayout;
    this._drawerOpened = state.app.drawerOpened;
    if (triggerDataRefresh) {
      if (this.shadowRoot.getElementById(this._page).triggerDataRefresh) {
        this.shadowRoot.getElementById(this._page).triggerDataRefresh();
      }
      if (document.getElementById("overlay")) {
        document.getElementById("overlay").close();
      }
      window.setTimeout(this._setScroll.bind(this, window.history.state && window.history.state.scroll), 20);
    }
  }
}

window.customElements.define('psr-router-app', PsrRouterApp);
