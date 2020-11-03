// Imports for this element
import { html } from 'lit-element';
import { PsrRouterRouteBattle } from './psr-router-route-battle';
import * as Route from 'SharedModules/psr-router-route';

// These are the elements needed by this element.
import '@vaadin/vaadin-dialog/theme/material/vaadin-dialog';
import 'SharedComponents/psr-router-trainer/psr-router-trainer';
import 'SharedComponents/psr-router-model/psr-router-battler';

class PsrRouterRouteEncounter extends PsrRouterRouteBattle {
  constructor(routeEntry = undefined) {
    super(routeEntry);
    // TODO
  }

  _getSummary(): string {
    return super._getSummary() || `Fight ${(<Route.RouteEncounter>super.routeEntry).encounter.toString()}`;
  }
}

window.customElements.define('psr-router-route-encounter', PsrRouterRouteEncounter);
