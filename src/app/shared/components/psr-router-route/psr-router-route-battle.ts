// Imports for this element
import { html } from 'lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';
import { Battler } from 'App/shared/modules/psr-router-model/ModelAbstract';
import { Stages, BadgeBoosts } from 'App/shared/modules/psr-router-util';

// These are the elements needed by this element.
import '@vaadin/vaadin-dialog/theme/material/vaadin-dialog';
import 'SharedComponents/psr-router-trainer/psr-router-trainer';
import 'SharedComponents/psr-router-model/psr-router-battler';
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
    dom.push(html`
      <style>
        table {
          width: 100%;
        }
        table[odd] {
          background-color: lightgray;
        }
        th {
          text-align: center;
        }
        table, th, td {
          border: 1px solid black;
          border-collapse: collapse;
          white-space: nowrap;
        }
        td {
          text-align: right;
        }
        table td:nth-child(3), table td:nth-child(4) {
          width: 50%;
          text-align: left;
        }
        .click {
          cursor: pointer;
        }
      </style>
      <vaadin-dialog id="battler-dialog"></vaadin-dialog>
    `);
    if (battleEntry.playerBefore) {
      if (battleEntry.playerBefore.team.length > 0) {
        let battle = [];
        for (let obi = 0; obi < battleEntry.trainer.party.length; obi++) {
          let ob = battleEntry.trainer.party[obi];
          let player = battleEntry.playersBefore[obi];
          let playerBattlers : Battler[] = [];
          if (battleEntry.shareExp) {
            battleEntry.shareExp[obi].forEach(pli => player.team[pli] && playerBattlers.push(player.team[pli]));
          } else {
            playerBattlers.push(player.team[0]);
          }
          for (let bi = 0; bi < playerBattlers.length; bi++) {
            let b = playerBattlers[bi];
            let movesAttacker = [];
            b.moveset.forEach(strMove => {
              let damageRange = battleEntry.game.engine.getDamageRange(battleEntry.game, strMove, b, ob, new Stages(), new Stages(), new BadgeBoosts(), new BadgeBoosts());
              movesAttacker.push(`${strMove}: ${damageRange.range.toString()} (${damageRange.critRange.toString()})`);
            });
            let movesDefender = [];
            ob.moveset.forEach(strMove => {
              let damageRange = battleEntry.game.engine.getDamageRange(battleEntry.game, strMove, ob, b, new Stages(), new Stages(), new BadgeBoosts(), new BadgeBoosts());
              movesDefender.push(`${strMove}: ${damageRange.range.toString()} (${damageRange.critRange.toString()})`);
            });
            let movesGrid = html`
              <table ?odd="${obi % 2 == 1}">
                <tr>
                  <th>BB</th>
                  <th>Stages</th>
                  <th class="click" @click="${this._showBattlerDialog.bind(this, b, null, null, true)}">${b.toString()} (${b.hp.toString()}hp, ${b.levelExp}/${b.pokemon.expGroup.getDeltaExp(b.level, b.level + 1)} exp.)</th>
                  <th class="click" @click="${this._showBattlerDialog.bind(this, ob, null, null, false)}">${ob.toString()} (${ob.hp.toString()}hp, ${ob.getExp()} exp.)</th>
                  <th>Stages</th>
                </tr>
                <tr><td>atk: cmb</td><td>atk: cmb</td><td>${movesAttacker[0] || "-"}</td><td>${movesDefender[0] || "-"}</td><td>atk: cmb</td></tr>
                <tr><td>def: cmb</td><td>def: cmb</td><td>${movesAttacker[1] || "-"}</td><td>${movesDefender[1] || "-"}</td><td>def: cmb</td></tr>
                <tr><td>spd: cmb</td><td>spd: cmb</td><td>${movesAttacker[2] || "-"}</td><td>${movesDefender[2] || "-"}</td><td>spd: cmb</td></tr>
                <tr><td>spc: cmb</td><td>spc: cmb</td><td>${movesAttacker[3] || "-"}</td><td>${movesDefender[3] || "-"}</td><td>spc: cmb</td></tr>
              </table>
            `;
            battle.push(movesGrid);
          }
        }
        dom.push(battle);
      } else {
        dom.push(html`<div>You don't have a team to battle with! (or maybe you blacked out? :Kappa:)</div>`);
      }
    } else {
      dom.push(html`<div>No player set!</div>`);
    }
    return dom;
  }

  constructor(routeEntry=undefined) {
    super(routeEntry);
    // TODO
  }

  _getTitle(): string {
    return super._getTitle() || (<Route.RouteBattle>super.routeEntry).trainer.toString();
  }

  _showBattlerDialog(battler: Battler, stages: Stages, badgeBoosts: BadgeBoosts, isPlayerBattler: boolean): void {
    const dialog: any = this.shadowRoot.getElementById("battler-dialog");
    dialog.renderer = (root: HTMLElement, dialog: any) => {
      let battlerElement: any = document.createElement('psr-router-battler');
      battlerElement.battler = battler;
      battlerElement.stages = stages ||new Stages();
      battlerElement.badgeBoosts = badgeBoosts || new BadgeBoosts();
      battlerElement.isPlayerBattler = !!isPlayerBattler;
      root.appendChild(battlerElement);
    };
    dialog.opened = true;
  }
}

window.customElements.define('psr-router-route-battle', PsrRouterRouteBattle);
