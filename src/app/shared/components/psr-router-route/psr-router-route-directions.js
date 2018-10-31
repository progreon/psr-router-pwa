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
  _renderPopupContent() {
    if (super.routeEntry.info.description) {
      var dom = [];
      var description = super.routeEntry.info.description;
      var is = 0; // istart
      while (is < description.length) {
        var i1 = description.indexOf("[[", is);
        var i2 = i1 >= 0 ? description.indexOf("]]", i1) : -1;
        if (i2 < 0) {
          dom.push(html`${description.substring(is)}`);
          is = description.length;
        } else {
          dom.push(html`<div style="white-space: pre-wrap;">${description.substring(is, i1)}</div>`);
          var img = description.substring(i1 + 2, i2);
          dom.push(html`<img src="${img}" style="width: 100%;"></img>`);
          is = i2 + 2;
        }
      }
      return dom;
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
