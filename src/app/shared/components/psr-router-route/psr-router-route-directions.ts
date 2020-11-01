// Imports for this element
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

export class PsrRouterRouteDirections extends PsrRouterRouteEntry {
  _getPopupContentRenderer() {
    if (this.routeEntry.info.description) {
      return (root: HTMLElement, dialog: HTMLElement) => {
        while (root.firstChild) {
          root.removeChild(root.firstChild);
        }
        let description = this.routeEntry.info.description;
        let is = 0; // istart
        while (is < description.length) {
          let i1 = description.indexOf("[[", is);
          let i2 = i1 >= 0 ? description.indexOf("]]", i1) : -1;
          if (i2 < 0) {
            const div = document.createElement("div");
            div.innerText = description.substring(is).trim();
            root.appendChild(div);
            is = description.length;
          } else {
            const div = document.createElement("div");
            div.innerText = description.substring(is, i1).trim();
            root.appendChild(div);
            const img = document.createElement("img");
            img.src = description.substring(i1 + 2, i2).trim();
            img.style.width = "100%";
            root.appendChild(img);
            is = i2 + 2;
          }
        }
      };
    } else {
      return undefined;
    }
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
