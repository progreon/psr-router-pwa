// Imports for this element
import { html, TemplateResult } from 'lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

export class PsrRouterRouteDirections extends PsrRouterRouteEntry {
  protected _getPopupContent(): TemplateResult {
    if (this.routeEntry.info.description) {
      let dom = [];
      let description = this.routeEntry.info.description;
      let is = 0; // istart
      while (is < description.length) {
        let i1 = description.indexOf("[[", is);
        let i2 = i1 >= 0 ? description.indexOf("]]", i1) : -1;
        if (i2 < 0) {
          dom.push(html`<div style="white-space: pre-wrap;">${description.substring(is).trim()}</div>`);
          is = description.length;
        } else {
          dom.push(html`<div style="white-space: pre-wrap;">${description.substring(is, i1).trim()}</div>`);
          dom.push(html`<img .src="${description.substring(i1 + 2, i2).trim()}" style="width:100%;" />`);
          is = i2 + 2;
        }
      }
      return html`${dom}`;
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
