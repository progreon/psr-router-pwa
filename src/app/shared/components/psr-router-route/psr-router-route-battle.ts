// Imports for this element
import { html } from 'lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';
import { Battler } from 'App/shared/modules/psr-router-model/ModelAbstract';
import { Stages, BadgeBoosts, Range } from 'App/shared/modules/psr-router-util';

// These are the elements needed by this element.
import '@vaadin/vaadin-dialog/theme/material/vaadin-dialog';
// import '@vaadin/vaadin-text-field/theme/material/vaadin-number-field';
import 'SharedComponents/psr-router-trainer/psr-router-trainer';
import 'SharedComponents/psr-router-model/psr-router-battler';
import { PsrRouterTrainer } from 'SharedComponents/psr-router-trainer/psr-router-trainer';
import { OpponentAction } from 'App/shared/modules/psr-router-route/psr-router-route-actions/OpponentAction';

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
    let battleEntry: Route.RouteBattle = <Route.RouteBattle>super.routeEntry;
    let dom = [];
    if (battleEntry.actions.length > 0) {
      battleEntry.actions.forEach((action, ai) => {
        if (action instanceof OpponentAction) {
          dom.push(html`${action.toString()}`);
          let oppAction = <OpponentAction>action;
          let oppDom = [];
          if (oppAction.actions.length > 0) {
            oppAction.actions.forEach(a => {
              oppDom.push(html`<li>${a.toString()}</li>`);
            });
            dom.push(html`<ul style="margin: 0px;">${oppDom}</ul>`);
          }
          if (oppDom.length == 0 && ai < battleEntry.actions.length) dom.push(html`<br>`);
        } else {
          dom.push(html`${action.toString()}`);
          if (ai < battleEntry.actions.length) dom.push(html`<br>`);
        }
      });
    }
    if (dom.length > 0) {
      dom.push(html`<hr>`);
    }
    dom.push(html`
      <style>
        .table {
          width: 100%;
          display: flex;
          flex-direction: row;
        }
        .table[odd] {
          background-color: lightgray;
        }
        .col {
          display: flex;
          flex-direction: column;
        }
        .table, .col > * {
          border: 1px solid black;
          border-collapse: collapse;
          white-space: nowrap;
        }
        .col > * {
          padding-left: 4px;
          display: flex;
          justify-content: space-between;
          flex-grow: 1;
        }
        .col div:first-child {
          font-weight: bold;
          /* text-align: center; */
        }
        /* .col > * vaadin-number-field {
          width: 75px;
          margin-left: 5px;
        } */
        .bcol {
          flex-grow: 1;
          display: flex;
          flex-direction: row;
        }
        .bcol > * {
          width: 50%;
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
        battleEntry.battleStages.forEach((battleStage, bsi) => {
          let ob = battleEntry.trainer.party[bsi];
          battleStage.damageRanges.forEach(dr => {
            let b = battleStage.player.team[dr.entrant.partyIndex];
            let bdr = dr.playerDR;
            let obdr = dr.trainerDR;
            let movesAttacker = b.moveset.map((strMove, i) => `${strMove}: ${bdr[i].range.toString()} (${bdr[i].critRange.toString()})`);
            let movesDefender = ob.moveset.map((strMove, i) => `${strMove}: ${obdr[i].range.toString()} (${obdr[i].critRange.toString()})`);
            let actualBB = battleStage.badgeBoosts;
            let actualStages = battleStage.stages;
            let opponentStages = battleStage.stagesOpponent;

            // calculate who's the fastest
            let bSpdRange = b.getBoostedSpd(actualBB.spd, actualStages.spd);
            let oSpdRange = ob.getBoostedSpd(0, 0); // TODO: stages
            let bf: string, of: string;
            if (bSpdRange.containsOneOf(oSpdRange)) {
              [bf, of] = ["[ST]", "[ST]"];
            } else if (bSpdRange.max < oSpdRange.min) {
              [bf, of] = ["", "[F]"];
            } else {
              [bf, of] = ["[F]", ""];
            }
            let movesGrid = html`
              <div class="table" ?odd="${bsi % 2 == 1}">
                <div class="col">
                  <div>BB</div>
                  <div>atk [< ${actualBB.atk} >]</div>
                  <div>def [< ${actualBB.def} >]</div>
                  <div>spd [< ${actualBB.spd} >]</div>
                  <div>spc [< ${actualBB.spc} >]</div>
                </div>
                <div class="col">
                  <div>Stages</div>
                  <div>atk [< ${actualStages.atk} >]</div>
                  <div>def [< ${actualStages.def} >]</div>
                  <div>spd [< ${actualStages.spd} >]</div>
                  <div>spc [< ${actualStages.spc} >]</div>
                </div>
                <div class="bcol">
                  <div class="col">
                    <div class="click" @click="${this._showBattlerDialog.bind(this, b, actualStages, actualBB, true)}">${dr.entrant.faint ? "*" : ""}${b.toString()} (${b.hp.toString()}hp, ${b.levelExp}/${b.pokemon.expGroup.getDeltaExp(b.level, b.level + 1)} exp.) ${bf}</div>
                    <div>${movesAttacker[0] || "-"}</div>
                    <div>${movesAttacker[1] || "-"}</div>
                    <div>${movesAttacker[2] || "-"}</div>
                    <div>${movesAttacker[3] || "-"}</div>
                  </div>
                  <div class="col">
                    <div class="click" @click="${this._showBattlerDialog.bind(this, ob, null, null, false)}">${ob.toString()} (${ob.hp.toString()}hp, ${ob.getExp()} exp.) ${of}</div>
                    <div>${movesDefender[0] || "-"}</div>
                    <div>${movesDefender[1] || "-"}</div>
                    <div>${movesDefender[2] || "-"}</div>
                    <div>${movesDefender[3] || "-"}</div>
                  </div>
                </div>
                <div class="col">
                  <div>Stages</div>
                  <div>atk [< ${opponentStages.atk} >]</div>
                  <div>def [< ${opponentStages.def} >]</div>
                  <div>spd [< ${opponentStages.spd} >]</div>
                  <div>spc [< ${opponentStages.spc} >]</div>
                </div>
              </div>
            `;
            battle.push(movesGrid);
          });
        });
        dom.push(battle);
      } else {
        dom.push(html`<div>You don't have a team to battle with! (or maybe you blacked out? :Kappa:)</div>`);
      }
    } else {
      dom.push(html`<div>No player set!</div>`);
    }
    return dom;
  }

  protected _hasExpandingContent(): boolean {
    return true;
  }

  constructor(routeEntry = undefined) {
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
      battlerElement.stages = stages || new Stages();
      battlerElement.badgeBoosts = badgeBoosts || new BadgeBoosts();
      battlerElement.isPlayerBattler = !!isPlayerBattler;
      root.appendChild(battlerElement);
    };
    dialog.opened = true;
  }
}

window.customElements.define('psr-router-route-battle', PsrRouterRouteBattle);
