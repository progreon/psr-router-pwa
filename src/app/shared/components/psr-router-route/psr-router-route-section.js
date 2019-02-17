// Imports for this element
import { LitElement, html } from '@polymer/lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

// Image imports for this element
import { angleDownIcon, angleUpIcon, circleIcon } from 'Shared/my-icons';

// These are the elements needed by this element.
// import '@vaadin/vaadin-item/vaadin-item';
import '@vaadin/vaadin-item/theme/material/vaadin-item';
import './psr-router-route-battle';
import './psr-router-route-directions';
import './psr-router-route-get-pokemon';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// TODO: show messages.
export class PsrRouterRouteSection extends PsrRouterRouteEntry {
  _renderExpandingContent() {
    var children = super.routeEntry ? super.routeEntry.getChildren() : [];
    var childElements = [];
    for (var i = 0; i < children.length; i++) {
      if (i !== 0)
        childElements.push(html`<hr />`);

      switch (children[i].constructor.getEntryType()) {
        case Route.RouteBattle.getEntryType():
          childElements.push(html`<psr-router-route-battle id="${'child-' + i}" .routeEntry=${children[i]}></psr-router-route-battle>`);
          break;
        case Route.RouteDirections.getEntryType():
          childElements.push(html`<psr-router-route-directions id="${'child-' + i}" .routeEntry=${children[i]}></psr-router-route-directions>`);
          break;
        case Route.RouteGetPokemon.getEntryType():
          childElements.push(html`<psr-router-route-get-pokemon id="${'child-' + i}" .routeEntry=${children[i]}></psr-router-route-get-pokemon>`);
          break;
        case Route.RouteSection.getEntryType():
          childElements.push(html`<psr-router-route-section id="${'child-' + i}" .routeEntry=${children[i]}></psr-router-route-section>`);
          break;
        case Route.RouteEntry.getEntryType():
        default:
          childElements.push(html`<psr-router-route-entry id="${'child-' + i}" .routeEntry=${children[i]}></psr-router-route-entry>`);
      }
    }
    if (childElements.length > 0) {
      return html`
          <style>
            hr {
              height: 1px;
              border: 0;
              border-top: 1px solid var(--app-color-black);
            }
          </style>
          ${childElements}
        `;
    } else {
      return undefined;
    }
  }

  static get properties() {
    return {
      // TODO
    }
  };

  constructor(routeEntry=undefined) {
    super(routeEntry);
    super.hideContent = false;
    // TODO
  }
}

window.customElements.define('psr-router-route-section', PsrRouterRouteSection);
