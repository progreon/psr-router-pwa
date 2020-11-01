// Imports for this element
import { html } from 'lit-element';
import { PsrRouterRouteDirections } from './psr-router-route-directions';
import * as Route from 'SharedModules/psr-router-route';
import 'SharedComponents/psr-router-model/psr-router-battler';

class PsrRouterRouteManip extends PsrRouterRouteDirections {
  _renderExpandingContent() {
    let manip = <Route.RouteManip>this.routeEntry;
    return html`
      <psr-router-battler .battler="${manip.battler}" isPlayerBattler hideBattleInfo></psr-router-battler>
    `;
  }

  protected _hasExpandingContent(): boolean {
    return true;
  }

  constructor(routeDirections?: Route.RouteDirections) {
    super(routeDirections);
  }

  _getSummary(): string {
    let summary = super._getSummary();
    if (!summary) {
      let manip = <Route.RouteManip>this.routeEntry;
      summary = `Manip ${manip.battler}`;
    }
    return summary;
  }
}

window.customElements.define('psr-router-route-manip', PsrRouterRouteManip);
