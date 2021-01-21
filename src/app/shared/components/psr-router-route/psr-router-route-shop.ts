// Imports for this element
import { html } from 'lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-mwc/psr-router-select';

class PsrRouterRouteShop extends PsrRouterRouteEntry {
  protected _renderExpandingContent() {
    let shop = (<Route.RouteShop>super.routeEntry);
    let list = [];
    shop.shopEntries.forEach(se => {
      list.push(html`<li>${se.toString(shop.player)}</li>`);
    });
    return html`<ul style="margin: 0px; padding-left: 20px;">${list}</ul>`;
  }

  protected _hasExpandingContent(): boolean {
    return true;
  }

  protected _getPopupContent() {
    return this._renderExpandingContent();
  }
}

window.customElements.define('psr-router-route-shop', PsrRouterRouteShop);
