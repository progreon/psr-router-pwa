// Imports for this element
import { customElement } from 'lit-element';
import { PsrRouterRouteSection } from './psr-router-route-section';
import * as Route from 'SharedModules/psr-router-route';

@customElement("psr-router-route")
export class PsrRouterRoute extends PsrRouterRouteSection {
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
