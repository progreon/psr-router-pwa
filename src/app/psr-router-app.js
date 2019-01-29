'use strict';

// JS Imports
import { GetGame } from 'SharedModules/psr-router-data';
import * as Util from 'SharedModules/psr-router-util';
import * as Route from 'SharedModules/psr-router-route';
import * as RouteUtil from 'SharedModules/psr-router-route/util';
import { RouteFactory } from 'SharedModules/psr-router-route/util';

// Imports for polymer/pwa
import { LitElement, html } from '@polymer/lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';
import { connect } from 'pwa-helpers/connect-mixin';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query';
import { installOfflineWatcher } from 'pwa-helpers/network';
import { installRouter } from 'pwa-helpers/router';
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
    var menuIcon = angleLeftIcon; // Default to back-arrow
    var athis = this;
    // Creating the menu links
    this._pageList.forEach(function(page) {
      if (athis._page === page.name) {
        menuIcon = barsIcon; // Normal menu icon if current page is a level 1 page
      }
      if (!page.is404) {
        const a = html`<a ?selected="${athis._page === page.name}" href="/${page.name}">${page.title}</a>`;
        linkList.push(a);
      }
    });
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
          --app-header-height: var(--app-grid-7x);
          --app-drawer-width: 256px;
          /* --app-footer-height: var(--app-grid-7x); */
          --app-footer-height: var(--app-grid-3x);
        }

        .header-layout {
          background-color: var(--app-background-color);
        }

        .drawer {
          color: var(--app-drawer-text-color);
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

        .title {
          padding: 0px 0px 0px var(--app-grid-2hx);
        }

        .toolbar-list {
          display: none;
          background-color: var(--app-header-menu-background-color);
        }

        .toolbar-list > a {
          display: inline-block;
          color: var(--app-header-menu-text-color);
          text-decoration: none;
          line-height: 30px;
          padding: 4px 24px;
        }

        .toolbar-list > a[selected] {
          color: var(--app-header-menu-selected-color);
          border-bottom: 4px solid var(--app-header-menu-selected-color);
        }

        /* Workaround for IE11 displaying <main> as inline */
        main {
          display: block;
          background-color: var(--app-main-background-color);
        }

        .main-content {
          height: 100%;
          @apply --layout-flex;
          /* padding: 0px;
          margin: 0px; */
          overflow: auto;
          overflow-y: scroll;
        }

        .page {
          display: none;
          padding: 0px var(--app-grid-3x);
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
          /* Uncomment this if you want the toolbar links to be visible when in wide view */
          .toolbar-list {
            display: block;
          }

          .menu-btn {
            display: none;
          }

          .main-content {
          }

          .footer {
            display: none;
          }

          paper-toast {
            width: 375px;
            max-width: 100%;
          }
        }
      </style>
      <!-- Add force-narrow if you don't want to show the toolbar when in wide view -->
      <app-drawer-layout fullbleed force-narrow>
        <!-- Drawer content -->
        <!-- Add swipe-open if you want the ability to swipe open the drawer -->
        <app-drawer slot="drawer" class="drawer" ?swipe-open="${!this._wideLayout}" ?opened="${this._drawerOpened}" @opened-changed="${e => store.dispatch(updateDrawerState(e.target.opened))}">
          <app-toolbar class="drawer-top">Menu</app-toolbar>
          <nav class="drawer-list">
            ${linkList}
          </nav>
        </app-drawer>

        <!-- Header content -->
        <app-header-layout fullbleed class="header-layout">
          <app-header slot="header" class="toolbar" fixed effects="waterfall">
            <app-toolbar class="toolbar-top" sticky>
              <div class="toolbar-top-content">
                <button class="menu-btn" title="Menu" @click="${_ => this._onMenuButtonClicked(menuIcon === angleLeftIcon)}">${menuIcon}</button>
                <div class="title">${this.appTitle}</div>
              </div>
            </app-toolbar>

            <!-- This gets hidden on a small screen-->
            <nav class="toolbar-list">
              ${linkList}
            </nav>
          </app-header>

          <!-- Main content -->
          <main role="main" class="main-content">
            <psr-router-home id="home" class="page" ?active="${this._page === 'home'}" .searchParams="${this._searchParams}"></psr-router-home>
            <psr-router-router id="router" class="page" ?active="${this._page === 'router'}" .searchParams="${this._searchParams}"></psr-router-router>
            <psr-router-items id="items" class="page" ?active="${this._page === 'items'}" .searchParams="${this._searchParams}"></psr-router-items>
            <psr-router-moves id="moves" class="page" ?active="${this._page === 'moves'}" .searchParams="${this._searchParams}"></psr-router-moves>
            <psr-router-pokemon-info id="pokemon-info" class="page" ?active="${this._page === 'pokemon-info'}" .searchParams="${this._searchParams}"></psr-router-pokemon-info>
            <psr-router-pokemon-list id="pokemon-list" class="page" ?active="${this._page === 'pokemon-list'}" .searchParams="${this._searchParams}"></psr-router-pokemon-list>
            <psr-router-trainers id="trainers" class="page" ?active="${this._page === 'trainers'}" .searchParams="${this._searchParams}"></psr-router-trainers>
            <psr-router-trainer-info id="trainer-info" class="page" ?active="${this._page === 'trainer-info'}" .searchParams="${this._searchParams}"></psr-router-pokemon-info>
            <psr-router-404 id="404" class="page" ?active="${this._page === '404'}" .searchParams="${this._searchParams}"></psr-router-404>

            <snack-bar ?active="${this._snackbarOpened}" ?offline="${this._offline}">
                You are now ${this._offline ? 'offline' : 'online'}.</snack-bar>
          </main>

          <footer class="footer">
            v${MyAppGlobals.version}
            <!-- [TODO: shortcuts] -->
          </footer>
        </app-header-layout>
      </app-drawer-layout>

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

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
    // Setting the list of pages
    this._pageList = [
      {name: 'home', title: "Home", element: 'psr-router-home'},
      // {name: 'redux', title: "Redux Example", element: 'psr-router-redux'},
      {name: 'router', title: "Route", element: 'psr-router-router'},
      {name: 'items', title: "Item List", element: 'psr-router-items'},
      {name: 'moves', title: "Move List", element: 'psr-router-moves'},
      {name: 'pokemon-list', title: "Pokemon List", element: 'psr-router-pokemon-list'},
      {name: 'trainers', title: "Trainer List", element: 'psr-router-trainers'},
      {name: '404', title: "404", element: 'psr-router-404', is404: true}
    ];
    // Handle the navigation caused by js code here.
    document.body.addEventListener('navigate', (e) => {
      if (e.detail.external) {
        window.location.href = e.detail.href;
      } else {
        window.history.pushState({}, '', e.detail.href);
        store.dispatch(navigate(window.location));
      }
    });

    // Load the last saved (json) route from the local storage if there is one,
    // else load the default example route.
    if (!RouteUtil.RouteManager.LoadSavedRoute()) {
      RouteUtil.RouteManager.LoadExampleRoute();
    }

    // console.debug("Route:", window.app.route);
    var game = RouteUtil.RouteManager.GetCurrentGame();
    console.debug("Game:", game);
    // console.debug("Pikachu:", window.app.game.findPokemonByName("Pikachu"));
    // console.debug("Route:", Route);
    // console.debug("Util:", Util);
  }

  firstUpdated(changedProperties) {
    // listen to the service worker promise in main.js to see if there has been a new update.
    window['isUpdateAvailable'].then(isAvailable => {
      if (isAvailable) {
        console.log("New Update Available! Reload the web app to get the latest juicy changes. (Oh Yeah!)");
        this._showToast(html`<div style="display: flex; justify-content: space-between; align-items: baseline;">New Update Available!<vaadin-button @click="${_ => window.location.reload(false)}">Reload</vaadin-button></div>`);
      }
    });
    // window.onunload = e => RouteUtil.RouteManager.SaveRoute();
    installRouter((location) => {store.dispatch(navigate(location))});
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: ${MyAppGlobals.wideWidth})`,
        (matches) => store.dispatch(updateLayout(matches)));
  }

  updated(changedProperties) {
    var athis = this;
    var title = "Where Am I?";
    this._pageList.forEach(function(page) {
      if (athis._page === page.name) {
        title = page.title;
      }
    });

    const pageTitle = this.appTitle + ' - ' + title;
    updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
    });
  }

  _onMenuButtonClicked(isBackButton) {
    if (!isBackButton)
      store.dispatch(updateDrawerState(true));
    else
      window.history.back();
  }

  _showToast(toastHtml) {
    this._toastHtml = toastHtml;
    var toast = this.shadowRoot.getElementById('toast').open();
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
    }
  }
}

window.customElements.define('psr-router-app', PsrRouterApp);
