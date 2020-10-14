// Imports for this element
import { html } from 'lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

// TODO: show messages.
class PsrRouterRouteMenu extends PsrRouterRouteEntry {
  _renderExpandingContent() {
    let dom = super._renderExpandingContent();
    let actionsDom = [];

    let entry = <Route.RouteMenu> super.routeEntry;
    entry.actions.forEach(action => {
      actionsDom.push(html`<li>${action}</li>`);
    });

    return html`${dom}<ul style="margin: 0px">${actionsDom}</ul>`;
  }

  protected _hasExpandingContent(): boolean {
    return true;
  }

  constructor(routeMenu?: Route.RouteMenu) {
    super(routeMenu);
  }
}

window.customElements.define('psr-router-route-menu', PsrRouterRouteMenu);
