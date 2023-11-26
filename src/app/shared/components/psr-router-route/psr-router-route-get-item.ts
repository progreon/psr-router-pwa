// Imports for this element
import { TemplateResult, html } from 'lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-mwc/psr-router-select';

class PsrRouterRouteGetItem extends PsrRouterRouteEntry {
  _renderExpandingContent() {
    let getI = (<Route.RouteGetItem>super.routeEntry);
    let str = `Get ${getI.item}`;
    if (getI.count != 1) {
      str += ` x${getI.count}`;
    }
    if (getI.tradedFor) {
      str += ` for ${getI.tradedFor.name}`;
    }
    return html`${str}`;
  }

  protected _hasExpandingContent(): boolean {
    return true;
  }

  protected _getPopupContent(): TemplateResult {
    return super._renderExpandingContent();
  }

  protected _getSummary() {
    let summary = super._getSummary();
    if (!summary?.trim() && !super._getTitle()?.trim()) {
      summary = super.routeEntry ? (<Route.RouteGetItem>super.routeEntry).toString() : "";
    }
    return summary;
  }
}

window.customElements.define('psr-router-route-get-item', PsrRouterRouteGetItem);
