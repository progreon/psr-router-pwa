'use strict';

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
import 'CoreComponents/snack-bar/snack-bar';

// Image imports for this element
import { barsIcon } from 'Shared/my-icons';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';
import * as style from 'App/my-app.css';

// This element is connected to the Redux store.
import { store } from 'Core/store.js';

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState,
  updateLayout
} from 'CoreActions/app.js';

class MyApp extends connect(store)(LitElement) {
  _render({appTitle, _drawerOpened, _offline, _page, _pageList, _searchParams, _snackbarOpened, _wideLayout}) {
    var linkList = [];
    if (_pageList) {
      _pageList.forEach(function(page) {
        if (!page.is404) {
          const a = html`<a selected?="${_page === page.name}" href="/${page.name}">${page.title}</a>`;
          linkList.push(a);
        }
      });
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

          --app-header-background-color: var(--app-color-white);
          --app-header-text-color: var(--app-dark-text-color);

          --app-header-menu-background-color: var(--app-color-slate);
          --app-header-menu-text-color: var(--app-dark-text-color);
          --app-header-menu-selected-color: var(--app-dark-text-color);

          --app-drawer-background-color: var(--app-color-white);
          --app-drawer-text-color: var(--app-dark-text-color);
          --app-drawer-selected-color: var(--app-dark-text-color);

          --app-drawer-header-background-color: var(--app-color-polymer-blue);
          --app-drawer-header-text-color: var(--app-light-text-color);

          --app-footer-text-color: var(--app-color-white);
          --app-footer-background-color: var(--app-color-polymer-blue);

          color: var(--app-dark-text-color);

          /* SIZES */
          --app-header-height: var(--app-grid-7x);
          --app-drawer-width: 256px;
          --app-footer-height: var(--app-grid-7x);
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
          border-bottom: 1px solid var(--app-drawer-selected-color);
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
        }

        .main-content {
          /* min-height: 100vh; */
          /* padding-bottom: var(--app-footer-height); */
          @apply --layout-flex;
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
        }
      </style>
      <!-- Add force-narrow if you don't want to show the toolbar when in wide view -->
      <app-drawer-layout fullbleed force-narrow>
        <!-- Drawer content -->
        <!-- Add swipe-open if you want the ability to swipe open the drawer -->
        <app-drawer slot="drawer" class="drawer" swipe-open?="${!_wideLayout}" opened="${_drawerOpened}" on-opened-changed="${e => store.dispatch(updateDrawerState(e.target.opened))}">
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
                <button class="menu-btn" title="Menu" on-click="${_ => store.dispatch(updateDrawerState(true))}">${barsIcon}</button>
                <div class="title">${appTitle}</div>
              </div>
            </app-toolbar>

            <!-- This gets hidden on a small screen-->
            <nav class="toolbar-list">
              ${linkList}
            </nav>
          </app-header>

          <!-- Main content -->
          <main role="main" class="main-content">
            <my-view1 class="page" active?="${_page === 'view1'}" searchParams="${_searchParams}"></my-view1>
            <my-view2 class="page" active?="${_page === 'view2'}" searchParams="${_searchParams}"></my-view2>
            <my-view404 class="page" active?="${_page === 'view404'}" searchParams="${_searchParams}"></my-view404>

            <snack-bar active?="${_snackbarOpened}">
                You are now ${_offline ? 'offline' : 'online'}.</snack-bar>
          </main>

          <footer class="footer">
            <p>[TODO: shortcuts]</p>
          </footer>
        </app-header-layout>
      </app-drawer-layout>
    `;
    return template;
  }

  static get properties() {
    return {
      appTitle: String,
      _drawerOpened: Boolean,
      _offline: Boolean,
      _page: String,
      _pageList: Object,
      _searchParams: Object,
      _snackbarOpened: Boolean,
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
      {name: 'view1', title: "Home", element: 'my-view1'},
      {name: 'view2', title: "Redux Example", element: 'my-view2'},
      {name: 'view404', title: "404", element: 'my-view404', is404: true}
    ];
  }

  _firstRendered() {
    installRouter((location) => {store.dispatch(navigate(location))});
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: ${MyAppGlobals.wideWidth})`,
        (matches) => store.dispatch(updateLayout(matches)));
  }

  _didRender(properties, changeList) {
    if ('_page' in changeList) {
      // TODO: change this to a proper title
      const pageTitle = properties.appTitle + ' - ' + changeList._page;
      updateMetadata({
          title: pageTitle,
          description: pageTitle
          // This object also takes an image property, that points to an img src.
      });
    }
  }

  _stateChanged(state) {
    this._page = state.app.page;
    this._offline = state.app.offline;
    this._searchParams = state.app.searchParams;
    this._snackbarOpened = state.app.snackbarOpened;
    this._wideLayout = state.app.wideLayout;
    this._drawerOpened = state.app.drawerOpened;
  }
}

window.customElements.define('my-app', MyApp);
