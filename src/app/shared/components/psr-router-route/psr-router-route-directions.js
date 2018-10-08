// Imports for this element
import { LitElement, html } from '@polymer/lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

// Image imports for this element
import { angleDownIcon, angleUpIcon, circleIcon } from 'Shared/my-icons';

// These are the elements needed by this element.
// import '@vaadin/vaadin-item/vaadin-item';
import '@vaadin/vaadin-item/theme/material/vaadin-item';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// TODO: show messages.
class PsrRouterRouteDirections extends PsrRouterRouteEntry {
  _renderRouteEntryContent() {
    // TODO
    return undefined;
  }

  _renderRouteEntryStyle() {
    // TODO
    return undefined;
  }

  static get properties() {
    return {
      // TODO
    }
  };

  constructor(routeEntry=undefined) {
    super(routeEntry);
    // TODO
  }
}

window.customElements.define('psr-router-route-directions', PsrRouterRouteDirections);
