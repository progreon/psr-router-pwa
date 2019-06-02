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
    let battleEntry: Route.RouteBattle = <Route.RouteBattle>super.routeEntry;
    if (!dom) {
      dom = [];
    } else {
      dom.push(html`<hr>`);
    }
    if (battleEntry.playerBefore) {
      if (battleEntry.playerBefore.getFrontBattler()) {
        let before = [];
        for (let i = 0; i < battleEntry.trainer.party.length; i++) {
          let player = battleEntry.playersBefore[i];
          let pp = [];
          player.team.forEach(b => {
            pp.push(html`<li>${b.toString()} (${b.levelExp} - ${b.getCurrentExpToNextLevel()} exp. left)</li>`);
          });
          let ob = battleEntry.trainer.party[i];
          before.push(html`<li>${ob.toString()} (gives ${ob.getExp()} exp.)<ul>${pp}</ul></li>`);
        }
        let after = [];
        battleEntry.playerAfter.team.forEach(b => {
          after.push(html`<li>${b.toString()} (${b.levelExp} - ${b.getCurrentExpToNextLevel()} exp. left)</li>`);
        });
        dom.push(html`<div>Battle:</div><ul>${before}</ul>`);
        dom.push(html`<div>After the battle:</div><ul>${after}</ul>`);
      } else {
        dom.push(html`<div>You don't have a team to battle with! (or maybe you blacked out? :Kappa:)</div>`);
      }
    } else {
      dom.push(html`<div>No player set!</div>`);
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
