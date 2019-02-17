// Imports for this element
import { LitElement, html } from '@polymer/lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

// Image imports for this element
import { angleDownIcon, angleUpIcon, circleIcon } from 'Shared/my-icons';

// These are the elements needed by this element.
// import '@vaadin/vaadin-item/vaadin-item';
import '@vaadin/vaadin-item/theme/material/vaadin-item';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// TODO: show messages.
class PsrRouterRouteDirections extends PsrRouterRouteEntry {
  _getPopupContentRenderer() {
    if (this.routeEntry.info.description) {
      return (root, dialog) => {
        while (root.firstChild) {
          root.removeChild(root.firstChild);
        }
        var description = this.routeEntry.info.description;
        var is = 0; // istart
        while (is < description.length) {
          var i1 = description.indexOf("[[", is);
          var i2 = i1 >= 0 ? description.indexOf("]]", i1) : -1;
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
            img.style = "width: 100%;";
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

  constructor(routeEntry=undefined) {
    super(routeEntry);
  }
}

window.customElements.define('psr-router-route-directions', PsrRouterRouteDirections);
