// JS imports
import { html, css, property } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { RouteManager } from 'SharedModules/psr-router-route/util';
import * as Route from 'SharedModules/psr-router-route';

// These are the elements needed by this element.
import '@material/mwc-button';
import 'SharedComponents/psr-router-route/psr-router-route';

class PsrRouterRouter extends PsrRouterPage {

  @property({ type: Object })
  public route: Route.Route;
  @property({ type: Object })
  public rootSection: Route.RouteSection;

  static get styles() {
    return [
      ...super.styles,
      css`
        .content {
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .right {
          display: flex;
          flex-flow: row wrap;
          max-width: 100%;
          align-self: flex-end;
        }
        /* ugly solution, I know... */
        .padding {
          padding-bottom: var(--app-grid-x);
        }
      `
    ];
  }

  _render() {
    return html`
      <div class="content">
        <div class="right">
          <mwc-button @click="${this._onEditRouteTextClicked}">Edit Route Text</mwc-button>
        </div>
        <psr-router-route id="the-route" class="noselect" .routeEntry="${this.rootSection}"></psr-router-route>
        <div class="padding"></div>
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
}

window.customElements.define('psr-router-router', PsrRouterRouter);
