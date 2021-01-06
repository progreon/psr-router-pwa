// Imports for this element
import { PsrRouterRouteSection } from './psr-router-route-section';
import * as Route from 'SharedModules/psr-router-route';

class PsrRouterRoute extends PsrRouterRouteSection {
  _renderContent() {
    return super._renderExpandingContent();
  }

  _renderExpandingContent() {
    return undefined;
  }

  protected _hasExpandingContent(): boolean {
    return false;
  }

  constructor(rootSection?: Route.RouteSection) {
    super(rootSection);
    this.routeHeader = true;
    // TODO
  }
}

window.customElements.define('psr-router-route', PsrRouterRoute);
