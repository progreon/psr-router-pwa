// Imports for this element
import { html } from 'lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

// TODO: show messages.
class PsrRouterRouteGetPokemon extends PsrRouterRouteEntry {
  _renderExpandingContent() {
    // TODO
    return html`
      ${super.routeEntry && (<Route.RouteGetPokemon>super.routeEntry).choices.length > 1 ? "Choose one:" : ""}
      ${super.routeEntry ? (<Route.RouteGetPokemon>super.routeEntry).choices.map(pl => pl.toString()).join(", ") : ""}
    `;
  }

  protected _hasExpandingContent(): boolean {
    return true;
  }

  _renderStyle() {
    // TODO
    return undefined;
  }

  constructor(routeEntry=undefined) {
    super(routeEntry);
    // TODO
  }
}

window.customElements.define('psr-router-route-get-pokemon', PsrRouterRouteGetPokemon);
