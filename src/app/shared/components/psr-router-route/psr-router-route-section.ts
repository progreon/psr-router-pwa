// Imports for this element
import { html } from 'lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

// These are the elements needed by this element.
import './psr-router-route-battle';
import './psr-router-route-directions';
import './psr-router-route-encounter';
import './psr-router-route-get-pokemon';
import './psr-router-route-manip';
import './psr-router-route-menu';

export class PsrRouterRouteSection extends PsrRouterRouteEntry {
  _renderExpandingContent() {
    let children = super.routeEntry ? (<Route.RouteSection>super.routeEntry).children : [];
    let childElements = [];
    for (let i = 0; i < children.length; i++) {
      if (i !== 0)
        childElements.push(html`<hr />`);

      switch (children[i].entryType) {
        case Route.RouteEncounter.ENTRY_TYPE:
          childElements.push(html`<psr-router-route-encounter id="${'child-' + i}" .routeEntry=${children[i]}></psr-router-route-encounter>`);
          break;
        case Route.RouteBattle.ENTRY_TYPE:
          childElements.push(html`<psr-router-route-battle id="${'child-' + i}" .routeEntry=${children[i]}></psr-router-route-battle>`);
          break;
        case Route.RouteDirections.ENTRY_TYPE:
          childElements.push(html`<psr-router-route-directions id="${'child-' + i}" .routeEntry=${children[i]}></psr-router-route-directions>`);
          break;
        case Route.RouteGetPokemon.ENTRY_TYPE:
          childElements.push(html`<psr-router-route-get-pokemon id="${'child-' + i}" .routeEntry=${children[i]}></psr-router-route-get-pokemon>`);
          break;
        case Route.RouteManip.ENTRY_TYPE:
          childElements.push(html`<psr-router-route-manip id="${'child-' + i}" .routeEntry=${children[i]}></psr-router-route-manip>`);
          break;
        case Route.RouteMenu.ENTRY_TYPE:
          childElements.push(html`<psr-router-route-menu id="${'child-' + i}" .routeEntry=${children[i]}></psr-router-route-menu>`);
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
              box-sizing: border-box;
              height: 1px;
              border: 0;
              border-top: 1px solid var(--app-color-black);
              margin: 4px 0px 4px 17px;
            }
          </style>
          ${childElements}
        `;
    } else {
      return undefined;
    }
  }

  protected _hasExpandingContent(): boolean {
    let children = super.routeEntry ? (<Route.RouteSection>super.routeEntry).children : [];
    return children.length > 0;
  }

  constructor(routeSection?: Route.RouteSection) {
    super(routeSection);
    super.hideContent = false;
    // TODO
  }
}

window.customElements.define('psr-router-route-section', PsrRouterRouteSection);
