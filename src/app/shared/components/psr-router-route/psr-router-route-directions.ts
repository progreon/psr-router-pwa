// Imports for this element
import { html, TemplateResult } from 'lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

export class PsrRouterRouteDirections extends PsrRouterRouteEntry {
  protected _getPopupContent(): TemplateResult {
    if (this.routeEntry.info.description) {
      return this._renderFancyString(this.routeEntry.info.description);
    }
    return undefined;
  }

  _renderExpandingContent() {
    return undefined;
  }

  protected _hasExpandingContent(): boolean {
    return false;
  }

  constructor(routeDirections?: Route.RouteDirections) {
    super(routeDirections);
  }
}

window.customElements.define('psr-router-route-directions', PsrRouterRouteDirections);
