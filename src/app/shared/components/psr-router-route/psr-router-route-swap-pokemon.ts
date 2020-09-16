// Imports for this element
import { html } from 'lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

// TODO: show messages.
class PsrRouterRouteSwapPokemon extends PsrRouterRouteEntry {
  _renderExpandingContent() {
    // TODO
    let e = (<Route.RouteSwapPokemon> super.routeEntry);
    let p1 = e.index1 >= 0 && e.index1 < e.playerBefore.team.length ? e.playerBefore.team[e.index1] : null;
    let p2 = e.index2 >= 0 && e.index2 < e.playerBefore.team.length ? e.playerBefore.team[e.index2] : null;
    if (p1 && p2) {
      return html`Swapping ${p1.toString()} with ${p2.toString()}`;
    } else {
      return html`Bad swap indices`;
    }
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

window.customElements.define('psr-router-route-swap-pokemon', PsrRouterRouteSwapPokemon);
