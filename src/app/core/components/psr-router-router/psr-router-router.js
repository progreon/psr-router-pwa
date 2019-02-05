import { html } from '@polymer/lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

// JS imports
import { RouteParser, RouteManager } from 'SharedModules/psr-router-route/util';
import * as Route from 'SharedModules/psr-router-route';

// These are the elements needed by this element.
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button/theme/material/vaadin-button';
import '@vaadin/vaadin-dialog/theme/material/vaadin-dialog';
import 'SharedComponents/psr-router-route/psr-router-route';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterRouter extends PsrRouterPage {
  _render() {
    return html`
      ${AppStyles}
      <style>
        /* ugly solution, I know... */
        /* .padding {
          padding-bottom: var(--app-grid-3x);
        } */
      </style>
      <psr-router-route id="the-route" class="noselect" .routeEntry=${this.route}></psr-router-route>
      <!-- <div class="padding"></div> -->
    `;
  }

  static get properties() {
    return {
      /* The route object. */
      route: Object,
      _loading: {
        type: Boolean,
        value: false
      }
    };
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.route = RouteManager.GetCurrentRoute();
  }

  triggerDataRefresh() {
    this.route = RouteManager.GetCurrentRoute();
  }
}

window.customElements.define('psr-router-router', PsrRouterRouter);
