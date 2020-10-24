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
        if (!this._battleStateCache) {
          this._updateBattleStateCache();
        }
        for (let obi = 0; obi < this._battleStateCache.length; obi++) {
          for (let bi = 0; bi < this._battleStateCache[obi].length; bi++) {
            let b = this._battleStateCache[obi][bi].playerB;
            let bdr = this._battleStateCache[obi][bi].playerDR;
            let ob = this._battleStateCache[obi][bi].trainerB;
            let obdr = this._battleStateCache[obi][bi].trainerDR;
            let movesAttacker = b.moveset.map((strMove, i) => `${strMove}: ${bdr[i].range.toString()} (${bdr[i].critRange.toString()})`);
            let movesDefender = ob.moveset.map((strMove, i) => `${strMove}: ${obdr[i].range.toString()} (${obdr[i].critRange.toString()})`);
            let battleStage = battleEntry.battleStages[obi];
            let actualBB = battleStage.badgeBoosts; //battleEntry.getActualBadgeBoosts();
            let actualStages = battleStage.stages;
            let movesGrid = html`
              <div class="table" ?odd="${obi % 2 == 1}">
                <div class="col">
                  <div>BB</div>
                  <div>atk [< ${actualBB.atk} >]</div>
                  <div>def [< ${actualBB.def} >]</div>
                  <div>spd [< ${actualBB.spd} >]</div>
                  <div>spc [< ${actualBB.spc} >]</div>
                </div>
                <div class="col">
                  <div>Stages</div>
                  <div>atk [< 0 >]</div>
                  <div>def [< 0 >]</div>
                  <div>spd [< 0 >]</div>
                  <div>spc [< 0 >]</div>
                </div>
                <div class="bcol">
                  <div class="col">
                    <div class="click" @click="${this._showBattlerDialog.bind(this, b, actualStages, actualBB, true)}">${b.toString()} (${b.hp.toString()}hp, ${b.levelExp}/${b.pokemon.expGroup.getDeltaExp(b.level, b.level + 1)} exp.)</div>
                    <div>${movesAttacker[0] || "-"}</div>
                    <div>${movesAttacker[1] || "-"}</div>
                    <div>${movesAttacker[2] || "-"}</div>
                    <div>${movesAttacker[3] || "-"}</div>
                  </div>
                  <div class="col">
                    <div class="click" @click="${this._showBattlerDialog.bind(this, ob, null, null, false)}">${ob.toString()} (${ob.hp.toString()}hp, ${ob.getExp()} exp.)</div>
                    <div>${movesDefender[0] || "-"}</div>
                    <div>${movesDefender[1] || "-"}</div>
                    <div>${movesDefender[2] || "-"}</div>
                    <div>${movesDefender[3] || "-"}</div>
                  </div>
                </div>
                <div class="col">
                  <div>Stages</div>
                  <div>atk [< 0 >]</div>
                  <div>def [< 0 >]</div>
                  <div>spd [< 0 >]</div>
                  <div>spc [< 0 >]</div>
                </div>
              </div>
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

  protected _hasExpandingContent(): boolean {
    return true;
  }

  private _battleStateCache: {
    playerB: Battler,
    playerDR: { range: Range, critRange: Range }[],
    trainerB: Battler,
    trainerDR: { range: Range, critRange: Range }[]
  }[][];

  constructor(routeEntry = undefined) {
    super(routeEntry);
    this._battleStateCache;
    // TODO
  }

  _updateBattleStateCache() {
    // Update damage range cache
    this._battleStateCache = [];
    let battleEntry: Route.RouteBattle = <Route.RouteBattle>super.routeEntry;

    if (battleEntry.playerBefore && battleEntry.playerBefore.team.length > 0) {
      for (let obi = 0; obi < battleEntry.trainer.party.length; obi++) {
        this._battleStateCache.push([]);
        let ob = battleEntry.trainer.party[obi];
        let battleStage = battleEntry.battleStages[obi];
        let actualBB = battleStage.badgeBoosts;
        let actualStages = battleStage.stages;
        let player = battleStage.player;
        let playerBattlers: Battler[] = [];
        battleStage.entrants.forEach(be => playerBattlers.push(player.team[be.partyIndex]));
        // if (battleEntry.shareExp) {
        //   battleEntry.shareExp[obi].forEach(pli => player.team[pli] && playerBattlers.push(player.team[pli]));
        // } else {
        //   playerBattlers.push(player.team[0]);
        // }
        for (let bi = 0; bi < playerBattlers.length; bi++) {
          let b = playerBattlers[bi];
          this._battleStateCache[obi].push({ playerB: b, playerDR: [], trainerB: ob, trainerDR: [] });
          b.moveset.forEach(strMove => this._battleStateCache[obi][bi].playerDR.push(battleEntry.game.engine.getDamageRange(battleEntry.game, strMove, b, ob, actualStages, new Stages(), actualBB, new BadgeBoosts())));
          ob.moveset.forEach(strMove => this._battleStateCache[obi][bi].trainerDR.push(battleEntry.game.engine.getDamageRange(battleEntry.game, strMove, ob, b, new Stages(), actualStages, new BadgeBoosts(), actualBB)));
        }
      }
    }
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
