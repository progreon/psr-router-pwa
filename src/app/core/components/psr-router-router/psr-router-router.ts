// JS imports
import { html, property } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { RouteManager } from 'SharedModules/psr-router-route/util';
import * as Route from 'SharedModules/psr-router-route';

// These are the elements needed by this element.
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button/theme/material/vaadin-button';
import '@vaadin/vaadin-dialog/theme/material/vaadin-dialog';
import 'SharedComponents/psr-router-route/psr-router-route';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterRouter extends PsrRouterPage {

  public route: Route.Route;
  @property({ type: Object })
  public rootSection: Route.RouteSection;

  _render() {
    return html`
      ${AppStyles}
      <style>
        /* ugly solution, I know... */
        /* .padding {
          padding-bottom: var(--app-grid-3x);
        } */
      </style>
      <psr-router-route id="the-route" class="noselect" .routeEntry="${this.rootSection}"></psr-router-route>
      <!-- <div class="padding"></div> -->
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
      this.route = RouteManager.GetCurrentRoute();
      this.route.apply();
    } catch (e) {
      console.error(e);
      window.alert("Unable to get the current route, see console for more details.");
    }
    if (this.rootSection != this.route?.rootSection) {
      this.rootSection = this.route?.rootSection;
      console.debug(this.route);
    }
  }
}

window.customElements.define('psr-router-router', PsrRouterRouter);
