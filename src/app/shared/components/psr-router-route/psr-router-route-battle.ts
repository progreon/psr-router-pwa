// Imports for this element
import { html, TemplateResult, css } from 'lit-element';
import { render } from 'lit-html';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';
import { Battler, Move } from 'App/shared/modules/psr-router-model/ModelAbstract';
import { Stages, BadgeBoosts, Range } from 'App/shared/modules/psr-router-util';
import { OpponentAction } from 'App/shared/modules/psr-router-route/psr-router-route-actions/OpponentAction';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-trainer/psr-router-trainer';
import 'SharedComponents/psr-router-model/psr-router-battler';

export class PsrRouterRouteBattle extends PsrRouterRouteEntry {
  protected _getPopupContent(): TemplateResult {
    if (this.routeEntry && (<Route.RouteBattle>super.routeEntry).trainer && !(<Route.RouteBattle>super.routeEntry).trainer.dummy) {
      return html`<psr-router-trainer .trainer="${(<Route.RouteBattle>super.routeEntry).trainer}"></psr-router-trainer>`;
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
      dom.push(html`<hr style="height: 1px; border: 0; background-color: rgba(0, 0, 0, .25); margin: 4px 0px 4px 0px;">`);
    }
    dom.push(html`
      <style>
        .table {
          width: 100%;
          display: flex;
          flex-direction: row;
        }
        .table[odd] {
          background-color: rgba(0, 0, 0, .1);
        }
        .col {
          display: flex;
          flex-direction: column;
        }
        .table, .col > div {
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
        .col > div > input {
          width: 40px;
          margin-left: 5px;
          background: transparent;
          border: 0px;
          border-left: 1px solid black;
        }
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
    `);
    if (battleEntry.player) {
      if (battleEntry.player.team.length > 0) {
        let battle = [];
        battleEntry.battleStages.forEach((battleStage, bsi) => {
          let ob = battleEntry.opponentParty[bsi];
          battleStage.damageRanges.forEach((dr, dri) => {
            let b = battleStage.player.team[dr.entrant.partyIndex];
            let bdr = dr.playerDR;
            let obdr = dr.trainerDR;
            let movesAttacker = b.moveset.map((ms, i) => {
              let move = ms.move;
              if (bdr[i].range.count == 0 && bdr[i].critRange.count == 0) {
                return { html: `${move}`, move, range: bdr[i].range, crange: bdr[i].critRange };
              } else {
                return { html: `${move}: ${bdr[i].range.toString()} (${bdr[i].critRange.toString()})`, move, range: bdr[i].range, crange: bdr[i].critRange, krs: bdr[i].killRanges };
              }
            });
            let movesDefender = ob.moveset.map((ms, i) => {
              let move = ms.move;
              if (obdr[i].range.count == 0 && obdr[i].critRange.count == 0) {
                return { html: `${move}`, move, range: obdr[i].range, crange: obdr[i].critRange };
              } else {
                return { html: `${move}: ${obdr[i].range.toString()} (${obdr[i].critRange.toString()})`, move, range: obdr[i].range, crange: obdr[i].critRange };
              }
            });
            let actualBB = battleStage.badgeBoosts;
            let actualStages = battleStage.stages;
            let opponentStages = battleStage.stagesOpponent;

            // calculate who's the fastest
            let bSpdRange = b.getBoostedSpd(actualBB.spd, actualStages.spd);
            let oSpdRange = ob.getBoostedSpd(0, 0); // TODO: stages
            let bf: string, of: string;
            if (bSpdRange.containsOneOf(oSpdRange)) {
              [bf, of] = ["[T]", "[T]"];
            } else if (bSpdRange.max < oSpdRange.min) {
              [bf, of] = ["", "[F]"];
            } else {
              [bf, of] = ["[F]", ""];
            }
            let movesGrid = html`
              <div class="table" ?odd="${bsi % 2 == 1}">
                <div class="col">
                  <div>BB</div>
                  <div>atk <input id="bbAtk${bsi}:${dri}" type="number" value="${actualBB.atk}" min="0" max="99" step="1" @change="${this._triggerDamageCalc.bind(this, battleStage, bsi, dri)}"></div>
                  <div>def <input id="bbDef${bsi}:${dri}" type="number" value="${actualBB.def}" min="0" max="99" step="1" @change="${this._triggerDamageCalc.bind(this, battleStage, bsi, dri)}"></div>
                  <div>spd <input id="bbSpd${bsi}:${dri}" type="number" value="${actualBB.spd}" min="0" max="99" step="1" @change="${this._triggerDamageCalc.bind(this, battleStage, bsi, dri)}"></div>
                  <div>spc <input id="bbSpc${bsi}:${dri}" type="number" value="${actualBB.spc}" min="0" max="99" step="1" @change="${this._triggerDamageCalc.bind(this, battleStage, bsi, dri)}"></div>
                </div>
                <div class="col">
                  <div>Stages</div>
                  <div>atk <input id="spAtk${bsi}:${dri}" type="number" value="${actualStages.atk}" min="-6" max="6" step="1" @change="${this._triggerDamageCalc.bind(this, battleStage, bsi, dri)}"></div>
                  <div>def <input id="spDef${bsi}:${dri}" type="number" value="${actualStages.def}" min="-6" max="6" step="1" @change="${this._triggerDamageCalc.bind(this, battleStage, bsi, dri)}"></div>
                  <div>spd <input id="spSpd${bsi}:${dri}" type="number" value="${actualStages.spd}" min="-6" max="6" step="1" @change="${this._triggerDamageCalc.bind(this, battleStage, bsi, dri)}"></div>
                  <div>spc <input id="spSpc${bsi}:${dri}" type="number" value="${actualStages.spc}" min="-6" max="6" step="1" @change="${this._triggerDamageCalc.bind(this, battleStage, bsi, dri)}"></div>
                </div>
                <div class="bcol">
                  <div class="col">
                    <div class="click" @click="${this._showBattlerDialog.bind(this, b, actualStages, actualBB, true)}">${dr.entrant.faint ? "*" : ""}${b.toString()} (${b.hp.toString()}hp, ${b.levelExp}/${b.pokemon.expGroup.getDeltaExp(b.level, b.level + 1)} exp.) ${bf}</div>
                    <div @mouseenter="${e => this._showMoveTooltip(e, movesAttacker[0])}">${movesAttacker[0]?.html || "-"}</div>
                    <div @mouseenter="${e => this._showMoveTooltip(e, movesAttacker[1])}">${movesAttacker[1]?.html || "-"}</div>
                    <div @mouseenter="${e => this._showMoveTooltip(e, movesAttacker[2])}">${movesAttacker[2]?.html || "-"}</div>
                    <div @mouseenter="${e => this._showMoveTooltip(e, movesAttacker[3])}">${movesAttacker[3]?.html || "-"}</div>
                  </div>
                  <div class="col">
                    <div class="click" @click="${this._showBattlerDialog.bind(this, ob, opponentStages, null, false)}">${ob.toString()} (${ob.hp.toString()}hp, ${ob.getExp()} exp.) ${of}</div>
                    <div @mouseenter="${e => this._showMoveTooltip(e, movesDefender[0])}">${movesDefender[0]?.html || "-"}</div>
                    <div @mouseenter="${e => this._showMoveTooltip(e, movesDefender[1])}">${movesDefender[1]?.html || "-"}</div>
                    <div @mouseenter="${e => this._showMoveTooltip(e, movesDefender[2])}">${movesDefender[2]?.html || "-"}</div>
                    <div @mouseenter="${e => this._showMoveTooltip(e, movesDefender[3])}">${movesDefender[3]?.html || "-"}</div>
                  </div>
                </div>
                <div class="col">
                  <div>Stages</div>
                  <div>atk <input id="soAtk${bsi}:${dri}" type="number" value="${opponentStages.atk}" min="-6" max="6" step="1" @change="${this._triggerDamageCalc.bind(this, battleStage, bsi, dri)}"></div>
                  <div>def <input id="soDef${bsi}:${dri}" type="number" value="${opponentStages.def}" min="-6" max="6" step="1" @change="${this._triggerDamageCalc.bind(this, battleStage, bsi, dri)}"></div>
                  <div>spd <input id="soSpd${bsi}:${dri}" type="number" value="${opponentStages.spd}" min="-6" max="6" step="1" @change="${this._triggerDamageCalc.bind(this, battleStage, bsi, dri)}"></div>
                  <div>spc <input id="soSpc${bsi}:${dri}" type="number" value="${opponentStages.spc}" min="-6" max="6" step="1" @change="${this._triggerDamageCalc.bind(this, battleStage, bsi, dri)}"></div>
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
    return html`${dom}`;
  }

  protected _hasExpandingContent(): boolean {
    return true;
  }

  constructor(routeEntry = undefined) {
    super(routeEntry);
    // TODO
  }

  _getTitle(): string {
    let battle = (<Route.RouteBattle>super.routeEntry);
    return super._getTitle() || (battle.trainer && battle.trainer.toString() || "");
  }

  _triggerDamageCalc(battleStage: Route.RouteBattle.Stage, bsi: number, dri: number): void {
    battleStage.badgeBoosts = this._getBadgeBoosts(bsi, dri);
    battleStage.stages = this._getStagesPlayer(bsi, dri);
    battleStage.stagesOpponent = this._getStagesOpponent(bsi, dri);
    this.requestUpdate();
  }

  _getBadgeBoosts(bsi: number, dri: number): BadgeBoosts {
    let bbAtk: any = this.shadowRoot.getElementById(`bbAtk${bsi}:${dri}`);
    let bbDef: any = this.shadowRoot.getElementById(`bbDef${bsi}:${dri}`);
    let bbSpd: any = this.shadowRoot.getElementById(`bbSpd${bsi}:${dri}`);
    let bbSpc: any = this.shadowRoot.getElementById(`bbSpc${bsi}:${dri}`);
    let bb = new BadgeBoosts();
    bb.atk = +bbAtk.value;
    bb.def = +bbDef.value;
    bb.spd = +bbSpd.value;
    bb.spc = +bbSpc.value;
    return bb;
  }

  _getStagesPlayer(bsi: number, dri: number): Stages {
    let spAtk: any = this.shadowRoot.getElementById(`spAtk${bsi}:${dri}`);
    let spDef: any = this.shadowRoot.getElementById(`spDef${bsi}:${dri}`);
    let spSpd: any = this.shadowRoot.getElementById(`spSpd${bsi}:${dri}`);
    let spSpc: any = this.shadowRoot.getElementById(`spSpc${bsi}:${dri}`);
    let sp = new Stages();
    sp.setStages(+spAtk.value, +spDef.value, +spSpd.value, +spSpc.value);
    return sp;
  }

  _getStagesOpponent(bsi: number, dri: number): Stages {
    let soAtk: any = this.shadowRoot.getElementById(`soAtk${bsi}:${dri}`);
    let soDef: any = this.shadowRoot.getElementById(`soDef${bsi}:${dri}`);
    let soSpd: any = this.shadowRoot.getElementById(`soSpd${bsi}:${dri}`);
    let soSpc: any = this.shadowRoot.getElementById(`soSpc${bsi}:${dri}`);
    let so = new Stages();
    so.setStages(+soAtk.value, +soDef.value, +soSpd.value, +soSpc.value);
    return so;
  }

  _showBattlerDialog(battler: Battler, stages: Stages, badgeBoosts: BadgeBoosts, isPlayerBattler: boolean): void {
    window.openMwcDialog(html`
        <psr-router-battler
          .battler="${battler}"
          .stages="${stages || new Stages()}"
          .badgeBoosts="${badgeBoosts || new BadgeBoosts()}"
          ?isPlayerBattler="${!!isPlayerBattler}"
        ></psr-router-battler>
      `, { "hideActions": true });
  }

  _showMoveTooltip(e: any, move: { html: string, move: Move, range: Range, crange: Range, krs?: number[] }) {
    if (move) {
      let valuesDOM = [];
      if (move.range.count > 0) {
        Object.keys(move.range.valueMap).forEach(k => {
          let v = move.range.valueMap[k];
          valuesDOM.push(html`<li>${k}: ${v}/${move.range.count}</li>`);
        });
      }
      let cvaluesDOM = [];
      if (move.crange.count > 0) {
        Object.keys(move.crange.valueMap).forEach(k => {
          let v = move.crange.valueMap[k];
          cvaluesDOM.push(html`<li>${k}: ${v}/${move.crange.count}</li>`);
        });
      }
      let killDOM = [];
      if (move.crange.count > 0 && move.krs) {
        move.krs.forEach((kr, kri) => {
          killDOM.push(html`<li>${kri + 1}: ${(kr * 100).toFixed(2)}%</li>`);
        });
      }
      let template = html`
        <style>
          ul, ol {
            margin: 0px;
            padding-left: 0px;
            list-style-type: none;
          }
        </style>
        <b>${move.move}</b> (${move.move.type}, ${move.move.power}, ${move.move.accuracy}%, ${move.move.pp}pp)<br>
        <i>${move.move.effect}</i>
        <div style="display: flex; flex-direction: row;">
          <div style="margin-right: 10px;" ?hidden="${valuesDOM.length == 0}">
            Non-crits:<ul>${valuesDOM}</ul>
          </div>
          <div style="margin-right: 10px;" ?hidden="${cvaluesDOM.length == 0}">
            Crits:<ul>${cvaluesDOM}</ul>
          </div>
          <div ?hidden="${killDOM.length == 0}">
            Kill%:<ul>${killDOM}</ul>
          </div>
        </div>
      `;
      window.showTooltip(template, e.path[0]);
    }
  }
}

window.customElements.define('psr-router-route-battle', PsrRouterRouteBattle);
