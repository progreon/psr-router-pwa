// JS imports
import { html, css, property, unsafeCSS, query } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { RouteManager } from 'SharedModules/psr-router-route/util';
import * as Route from 'SharedModules/psr-router-route';

import { listUlIcon } from 'Shared/my-icons';
import { puzzlePieceIcon } from 'Shared/my-icons';
import { PsrRouterRoute } from 'SharedComponents/psr-router-route/psr-router-route';

// These are the elements needed by this element.
import '@material/mwc-button';
import 'SharedComponents/psr-router-route/psr-router-route';

class PsrRouterRouter extends PsrRouterPage {

  @property({ type: Object })
  public route: Route.Route;
  @property({ type: Object })
  public rootSection: Route.RouteSection;
  @property({ type: Boolean })
  private _showChapters: boolean = true;
  @property({ type: Boolean })
  private _showPlugins: boolean = true;
  @query("#the-route")
  private _theRouteDOM: PsrRouterRoute;

  static get styles() {
    return css`
      ${super.styles}
      .content {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: stretch;
      }
      .clickable {
        cursor: pointer;
      }
      .sidebar {
        display: none;
      }
      .main {
        display: flex;
        height: 100%;
        flex: 1;
        flex-direction: column;
        align-items: stretch;
      }
      .actions {
        display: none;
        justify-content: space-between;
        padding: var(--app-grid-x);
        align-items: center;
      }
      .action-btn {
        width: var(--app-grid-4x);
        height: var(--app-grid-4x);
        border: 1px solid gray;
        border-radius: var(--app-grid-x);;
        text-align: center;
        fill: var(--app-dark-text-color);
        background-color: var(--app-color-blue);
        cursor: pointer;
      }
      .action-btn[active] {
        background-color: var(--app-color-yellow);
      }
      .action-btn > svg {
        vertical-align: middle;
      }
      .action-btn:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      #route {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0px var(--app-grid-x);
        overflow-y: scroll;
        /* overflow-x: hidden; */
      }
      #the-route {
        max-width: 1000px;
        /* overflow-x: hidden; */
      }
      .right-align {
        display: flex;
        flex-flow: row wrap;
        max-width: 100%;
        align-self: flex-end;
      }
      /* ugly solution, I know... */
      .padding {
        padding-bottom: var(--app-grid-x);
      }

      /* Wide layout: when the viewport width is bigger than 640px, layout
      changes to a wide layout. */
      @media (min-width: ${unsafeCSS(window.MyAppGlobals.wideWidth)}) {
        .sidebar {
          padding: var(--app-grid-2x);
          overflow-y: auto;
        }
        .sidebar > h4 {
          margin: var(--app-grid-x) 0px;
          font-weight: bold;
        }
        .sidebar-left:not([hidden]) {
          display: block;
          width: 300px;
          min-width: 300px;
          border-right: 1px solid var(--app-dark-text-color);
        }
        .chapters-list {
          margin: 0px;
          padding-left: var(--app-grid-2x);
        }
        .chapters-list > li {
          list-style: none;
          padding: var(--app-grid-x) 0px;
        }
        .chapters-list > li:hover {
          text-decoration: underline;
        }
        .actions {
          display: flex;
        }
        #route {
          /* width: unset; */
          /* flex: 1; */
          overflow-x: hidden;
          padding: 0px var(--app-grid-2x);
        }
        .sidebar-right:not([hidden]) {
          display: block;
          width: 300px;
          min-width: 300px;
          border-left: 1px solid var(--app-dark-text-color);
        }
      }
    `;
  }

  _render() {
    console.log(this.rootSection);
    let chaptersUl = html`
      <ul class="chapters-list">
        ${this.rootSection?.children?.map(entry => {
          return html`<li class="clickable" @click="${() => this._scrollToEntry(entry)}">${entry.info.toString()}</li>`;}
        )}
      </ul>
    `;

    return html`
      <div class="content">
        <div class="sidebar sidebar-left" id="chapters" ?hidden="${!this._showChapters}">
          <h4 class="clickable" @click="${() => this._scrollToEntry(this.rootSection)}">${this.rootSection?.info}</h4>
          ${chaptersUl}
        </div>
        <div class="main">
          <div class="actions">
            <div id="chapters-btn" class="action-btn" ?active="${this._showChapters}" @click="${() => this._showChapters = !this._showChapters}">${listUlIcon}</div>
            <div id="plugins-btn" class="action-btn" ?active="${this._showPlugins}" @click="${() => this._showPlugins = !this._showPlugins}">${puzzlePieceIcon}</div>
          </div>
          <div id="route">
            <psr-router-route id="the-route" class="noselect" .routeEntry="${this.rootSection}"></psr-router-route>
            <div class="padding"></div>
          </div>
        </div>
        <div class="sidebar sidebar-right" id="plugins" ?hidden="${!this._showPlugins}">
          <h4>Plugins</h4>
          <mwc-button @click="${this._onEditRouteTextClicked}">Edit Route Text</mwc-button>
        </div>
      </div>
    `;
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._loadRoute();
  }

  triggerDataRefresh() {
    this._loadRoute();
  }

  private _loadRoute() {
    try {
      if (this.route != RouteManager.GetCurrentRoute()) {
        this.route = RouteManager.GetCurrentRoute();
        this.route?.apply();
      }
    } catch (e) {
      console.error(e);
      window.alert("Unable to get the current route, see console for more details.");
    }
    if (this.rootSection != this.route?.rootSection) {
      this.rootSection = this.route?.rootSection;
      console.debug("Loaded new route", this.route);
    }
  }

  private _onEditRouteTextClicked(e) {
    super._navigateTo("router-text");
  }

  private _scrollToEntry(entry: Route.RouteEntry) {
    let entryDOM = this._theRouteDOM.findEntryDOM(entry);
    if (entryDOM) {
      entryDOM.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

window.customElements.define('psr-router-router', PsrRouterRouter);
