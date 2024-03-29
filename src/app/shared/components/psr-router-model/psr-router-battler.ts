// Imports for this element
import { LitElement, html, property, css } from 'lit-element';
import { Battler } from 'App/shared/modules/psr-router-model/ModelAbstract';
import { BadgeBoosts, Stages } from 'App/shared/modules/psr-router-util';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class PsrRouterBattler extends LitElement {

  @property({type: Object})
  public battler: Battler;
  @property({type: Object})
  public stages: Stages;
  @property({type: Object})
  public badgeBoosts: BadgeBoosts;
  @property({type: Boolean})
  public isPlayerBattler: boolean;
  @property({type: Boolean})
  public hideBattleInfo: boolean;

  static styles = css`
    ${AppStyles}
  `;

  render() {
    if (this.battler) {
      let b = this.battler;
      let bb = this.badgeBoosts;
      let st = this.stages;
      let dvs = b.getDVRanges();
      return html`
        <style>
          .content {
            width: 300px;
            max-width: 100%;
          }
          .stats-grid {
            width: 100%;
            border: 1px solid black;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .stats-grid > div {
            display: flex;
            width: 100%;
          }
          .stats-grid > div > div {
            flex: 1;
            /* width: 1px; */
            /* width: 20%; */
            /* min-width: 1px; */
            /* border: 1px solid red; */
            white-space: nowrap;
            text-align: center;
          }
          .stats-grid > div[hidden] {
            display: none;
          }
          .table {
            display: flex;
            width: 100%;
            flex-direction: column;
            align-items: center;
          }
          .table[hidden] {
            display: none;
          }
          .table > div {
            display: flex;
            width: 100%;
          }
          .table > div[hidden] {
            display: none;
          }
          .table > div > div {
            flex: 1;
            /* width: 1px; */
            /* width: 50%; */
            /* border: 1px solid red; */
            white-space: nowrap;
          }
          .table > div :first-child {
            text-align: right;
            padding-right: 2px;
          }
          .table > div :last-child {
            text-align: left;
            padding-left: 2px;
          }
        </style>
        <div class="content">
          <b>${b.toString()}</b>
          <div class="table" ?hidden="${this.hideBattleInfo}">
            <div ?hidden="${!this.isPlayerBattler}"><div>Exp. to next lv:</div><div>${b.getCurrentExpToNextLevel()} (${b.levelExp}/${b.pokemon.expGroup.getDeltaExp(b.level, b.level + 1)})</div></div>
            <div ?hidden="${this.isPlayerBattler}"><div>Given exp.:</div><div>${b.getExp()}</div></div>
            <div><div>Crit ratio:</div><div>${(b.pokemon.getCritRatio() * 100).toFixed(3)} %</div></div>
            <div><div>High crit ratio:</div><div>${(b.pokemon.getHighCritRatio() * 100).toFixed(3)} %</div></div>
            <div ?hidden="${!this.isPlayerBattler}"><div>Redbar at:</div><div>< ${b.hp.multiplyBy(53).divideBy(256, true).add(1)} hp</div></div>
          </div>
          <div class="stats-grid">
            <b>DVs</b>
            <div><div>HP</div><div>Atk</div><div>Def</div><div>Spd</div><div>Spc</div></div>
            <div>
              <div>${dvs[0].toString()}</div>
              <div>${dvs[1].toString()}</div>
              <div>${dvs[2].toString()}</div>
              <div>${dvs[3].toString()}</div>
              <div>${dvs[4].toString()}</div>
            </div>
          </div>
          <div class="stats-grid">
            <b>Stats</b>
            <div><div>HP</div><div>Atk</div><div>Def</div><div>Spd</div><div>Spc</div></div>
            <div>
              <div>${b.hp}</div>
              <div>${b.atk}</div>
              <div>${b.def}</div>
              <div>${b.spd}</div>
              <div>${b.spc}</div>
            </div>
            <b ?hidden="${!bb && !st}">With boosts</b>
            <div ?hidden="${!bb && !st}">
              <div>${b.hp}</div>
              <div>${b.getBoostedAtk(bb?.atk || 0, st?.atk || 0)}</div>
              <div>${b.getBoostedDef(bb?.def || 0, st?.def || 0)}</div>
              <div>${b.getBoostedSpd(bb?.spd || 0, st?.spd || 0)}</div>
              <div>${b.getBoostedSpc(bb?.spc || 0, st?.spc || 0)}</div>
            </div>
          </div>
        </div>
      `;
    } else {
      return html`
        Loading...
      `;
    }
  }

  constructor(battler: Battler, stages: Stages, badgeBoosts: BadgeBoosts, isPlayerBattler: Boolean) {
    super();
    this.battler = battler;
    this.stages = stages;
    this.badgeBoosts = badgeBoosts;
    this.isPlayerBattler = !!isPlayerBattler;
  }
}

window.customElements.define('psr-router-battler', PsrRouterBattler);
export { PsrRouterBattler };
