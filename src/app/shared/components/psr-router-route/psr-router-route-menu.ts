// Imports for this element
import { html, TemplateResult } from 'lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

class PsrRouterRouteMenu extends PsrRouterRouteEntry {
  protected _getPopupContent(): TemplateResult {
    return this._renderExpandingContent();
  }

  _renderExpandingContent() {
    let dom = super._renderExpandingContent();
    let actionsDom = [];

    let entry = <Route.RouteMenu> super.routeEntry;
    entry.actions.forEach(action => {
      actionsDom.push(html`<li>${action}</li>`);
    });

    return html`${dom}<ul style="margin: 0px; padding-left: 20px;">${actionsDom}</ul>`;
  }

  protected _hasExpandingContent(): boolean {
    return true;
  }

  protected _getSummary() {
    let summary = super._getSummary();
    if (!summary?.trim() && !super._getTitle()?.trim()) {
      summary = super.routeEntry ? (<Route.RouteMenu>super.routeEntry).toString() : "";
      if (!summary?.trim()) {
        summary = super.routeEntry.entryType;
      }
    }
    return summary;
  }

  constructor(routeMenu?: Route.RouteMenu) {
    super(routeMenu);
  }
}

window.customElements.define('psr-router-route-menu', PsrRouterRouteMenu);
