// Imports for this element
import { html } from 'lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

// These are the elements needed by this element.
// import '@vaadin/vaadin-item/vaadin-item';
import '@vaadin/vaadin-item/theme/material/vaadin-item';
import './psr-router-route-battle';
import './psr-router-route-directions';
import './psr-router-route-get-pokemon';

export class PsrRouterRouteSection extends PsrRouterRouteEntry {
  _renderExpandingContent() {
    let children = super.routeEntry ? (<Route.RouteSection>super.routeEntry).children : [];
    let childElements = [];
    for (let i = 0; i < children.length; i++) {
      if (i !== 0)
        childElements.push(html`<hr />`);

      switch (children[i].entryType) {
        case Route.RouteBattle.ENTRY_TYPE:
          childElements.push(html`<psr-router-route-battle id="${'child-' + i}" .routeEntry=${children[i]}></psr-router-route-battle>`);
          break;
        case Route.RouteDirections.ENTRY_TYPE:
          childElements.push(html`<psr-router-route-directions id="${'child-' + i}" .routeEntry=${children[i]}></psr-router-route-directions>`);
          break;
        case Route.RouteGetPokemon.ENTRY_TYPE:
          childElements.push(html`<psr-router-route-get-pokemon id="${'child-' + i}" .routeEntry=${children[i]}></psr-router-route-get-pokemon>`);
          break;
        case Route.RouteSection.ENTRY_TYPE:
          childElements.push(html`<psr-router-route-section id="${'child-' + i}" .routeEntry=${children[i]}></psr-router-route-section>`);
          break;
        case Route.RouteEntry.ENTRY_TYPE:
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

  constructor(routeSection?: Route.RouteSection) {
    super(routeSection);
    super.hideContent = false;
    // TODO
  }
}

window.customElements.define('psr-router-route-section', PsrRouterRouteSection);
