// Imports for this element
import { PsrRouterRouteSection } from './psr-router-route-section';
import * as Route from 'SharedModules/psr-router-route';

// TODO: show messages.
class PsrRouterRoute extends PsrRouterRouteSection {
  _renderContent() {
    return super._renderExpandingContent();
  }

  _renderExpandingContent() {
    return undefined;
  }

  constructor(route?: Route.Route) {
    super(route);
    this.routeHeader = true;
    // TODO
  }
}

window.customElements.define('psr-router-route', PsrRouterRoute);
