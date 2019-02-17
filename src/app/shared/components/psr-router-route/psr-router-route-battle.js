// Imports for this element
import { LitElement, html } from '@polymer/lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

// Image imports for this element
import { angleDownIcon, angleUpIcon, circleIcon } from 'Shared/my-icons';

// These are the elements needed by this element.
// import '@vaadin/vaadin-item/vaadin-item';
import '@vaadin/vaadin-item/theme/material/vaadin-item';
import 'SharedComponents/psr-router-trainer/psr-router-trainer';
import 'SharedComponents/psr-router-trainer/psr-router-trainer';
import { PsrRouterTrainer } from 'SharedComponents/psr-router-trainer/psr-router-trainer';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// TODO: show messages.
class PsrRouterRouteBattle extends PsrRouterRouteEntry {
  _getPopupContentRenderer() {
    if (this.routeEntry && this.routeEntry.trainer && !this.routeEntry.trainer.dummy) {
      return (root, dialog) => {
        while (root.firstChild) {
          root.removeChild(root.firstChild);
        }
        const trainerElement = document.createElement("psr-router-trainer");
        trainerElement.trainer = this.routeEntry ? this.routeEntry.trainer : null;
        root.appendChild(trainerElement);
      };
    } else {
      return undefined;
    }
  }

  _renderExpandingContent() {
    var dom = super._renderExpandingContent();
    if (super.routeEntry && super.routeEntry.shareExp) {
      if (!dom) {
        dom = [];
      }
      dom.push(html`<div>${JSON.stringify(super.routeEntry.shareExp)}</div>`);
    }
    return dom;
  }

  _getTitle() {
    return super._getTitle() || super.routeEntry.trainer.toString();
  }

  static get properties() {
    return {
      // TODO
    }
  };

  constructor(routeEntry=undefined) {
    super(routeEntry);
    // TODO
  }
}

window.customElements.define('psr-router-route-battle', PsrRouterRouteBattle);
