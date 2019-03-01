// Imports for this element
import { html } from 'lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-trainer/psr-router-trainer';
import { PsrRouterTrainer } from 'SharedComponents/psr-router-trainer/psr-router-trainer';

// TODO: show messages.
class PsrRouterRouteBattle extends PsrRouterRouteEntry {
  _getPopupContentRenderer() {
    if (this.routeEntry && (<Route.RouteBattle>super.routeEntry).trainer && !(<Route.RouteBattle>super.routeEntry).trainer.dummy) {
      return (root: HTMLElement, dialog: HTMLElement) => {
        while (root.firstChild) {
          root.removeChild(root.firstChild);
        }
        const trainerElement: PsrRouterTrainer = <PsrRouterTrainer>document.createElement("psr-router-trainer");
        trainerElement.trainer = this.routeEntry ? (<Route.RouteBattle>super.routeEntry).trainer : null;
        root.appendChild(trainerElement);
      };
    } else {
      return undefined;
    }
  }

  _renderExpandingContent() {
    let dom = super._renderExpandingContent();
    if (super.routeEntry && (<Route.RouteBattle>super.routeEntry).shareExp) {
      if (!dom) {
        dom = [];
      }
      dom.push(html`<div>${JSON.stringify((<Route.RouteBattle>super.routeEntry).shareExp)}</div>`);
    }
    return dom;
  }

  _getTitle(): string {
    return super._getTitle() || (<Route.RouteBattle>super.routeEntry).trainer.toString();
  }

  constructor(routeEntry=undefined) {
    super(routeEntry);
    // TODO
  }
}

window.customElements.define('psr-router-route-battle', PsrRouterRouteBattle);
