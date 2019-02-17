// Imports for this element
import { LitElement, html } from 'lit-element';
import { PsrRouterRouteSection } from './psr-router-route-section';
import * as Route from 'SharedModules/psr-router-route';

// Image imports for this element
import { angleDownIcon, angleUpIcon, circleIcon } from 'Shared/my-icons';

// These are the elements needed by this element.
// import '@vaadin/vaadin-item/vaadin-item';
import '@vaadin/vaadin-item/theme/material/vaadin-item';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// TODO: show messages.
class PsrRouterRoute extends PsrRouterRouteSection {
  _renderContent() {
    return super._renderExpandingContent();
  }

  _renderExpandingContent() {
    return undefined;
  }

  static get properties() {
    return {
      // TODO
    }
  };

  constructor(routeEntry=undefined) {
    super(routeEntry);
    this.routeHeader = true;
    // TODO
  }
}

window.customElements.define('psr-router-route', PsrRouterRoute);
