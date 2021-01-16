// Imports for this element
import { html } from 'lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-mwc/psr-router-select';

class PsrRouterRouteGetItem extends PsrRouterRouteEntry {
  _renderExpandingContent() {
    let getI = (<Route.RouteGetItem>super.routeEntry);
    if (getI.tradedFor) {
      return html`Get ${getI.item} for ${getI.tradedFor}`;
    } else {
      return html`Get ${getI.item}`;
    }
  }

  protected _hasExpandingContent(): boolean {
    return true;
  }

  protected _getSummary() {
    let summary = super._getSummary();
    if (!summary?.trim() && !super._getTitle()?.trim()) {
      summary = super.routeEntry ? (<Route.RouteGetPokemon>super.routeEntry).toString() : "";
    }
    return summary;
  }
}

window.customElements.define('psr-router-route-get-item', PsrRouterRouteGetItem);
