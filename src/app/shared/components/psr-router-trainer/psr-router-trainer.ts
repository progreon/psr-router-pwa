// Imports for this element
import { LitElement, html, css, property } from 'lit-element';
import { Trainer } from 'App/shared/modules/psr-router-model/Model';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';
import 'SharedComponents/psr-router-move/psr-router-move';

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class PsrRouterTrainer extends LitElement {

  @property({type: Trainer})
  public trainer: Trainer;

  static styles = css`
    ${AppStyles}
    :host {
      display: block;
    }
    .flex-container {
      display: flex;
      flex-direction: column;
      margin: 5px;
    }
    .flex-container > * {
      margin: 0px;
      display: flex;
    }
    h1, h2, h3, h4 {
      align-self: center;
    }
    .pokemon {
      cursor: pointer;
    }
    .flex-container > .section {
      flex-direction: column;
      width: 100%;
      align-items: stretch;
    }
    hr {
      border-width: 1px 0px 0px 0px;
      border-color: var(--app-dark-text-color);
    }
    hr[hidden] {
      border: none;
    }
    .column {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .column > * {
      display: flex;
      flex-direction: row;
      margin: 0px;
    }
    .column > .center {
      display: block;
      text-align: center;
    }
    .column > * > * {
      flex: 1;
      text-align: center;
    }
    [hidden] {
      display: none;
    }
  `;

  render() {
    let party = [];
    if (this.trainer) {
      this.trainer.party.forEach((b, bi) => {
        let ms = b.moveset;
        party.push(html`
          <div class="column">
            <h2 class="pokemon" @click="${this._onPokemonClicked.bind(this, b.pokemon.name)}">${b.pokemon.name} L${b.level}</h2>
            <div class="center">${b.getExp()} exp. points</div>
            <div>
              <div id=${`move-${bi}-0`} style="cursor: pointer;" @mouseenter="${e => this._showMoveTooltip(ms[0]?.move, `move-${bi}-0`)}">${ms[0]?.move}</div>
              <div id=${`move-${bi}-1`} style="cursor: pointer;" @mouseenter="${e => this._showMoveTooltip(ms[1]?.move, `move-${bi}-1`)}">${ms[1]?.move}</div>
            </div>
            <div>
              <div id=${`move-${bi}-2`} style="cursor: pointer;" @mouseenter="${e => this._showMoveTooltip(ms[2]?.move, `move-${bi}-2`)}">${ms[2]?.move}</div>
              <div id=${`move-${bi}-3`} style="cursor: pointer;" @mouseenter="${e => this._showMoveTooltip(ms[3]?.move, `move-${bi}-3`)}">${ms[3]?.move}</div>
            </div>
          </div>`);
      });
    }

    return html`
      <div class="flex-container">
        <h1>${this.trainer ? this.trainer.name : ""}</h1>
        <h3 ?hidden="${!this.trainer || !this.trainer.alias}"><i>${this.trainer ? this.trainer.alias : ""}</i></h3>
        <h3>${this.trainer ? this.trainer.location : ""}</h3>
        <h4 ?hidden="${!this.trainer || !this.trainer.items || this.trainer.items.length == 0}">Gives item: ${this.trainer.items.join(", ")}</h4>
        <h4 ?hidden="${!this.trainer || !this.trainer.badgeboost}">Gives badgeboost: ${this.trainer.badgeboost}</h4>
        <h4>Prize: ₽${this.trainer.money}</h4>
        <hr ?hidden="${!this.trainer || this.trainer.party.length == 0}">
        <div class="section">
          ${party}
        </div>
      </div>
    `;
  }

  constructor(trainer) {
    super();
    this.trainer = trainer;
  }

  _onPokemonClicked(pokemon) {
    const event = new CustomEvent("navigate", { detail: { href: 'pokemon-info?p=' + pokemon } });
    document.body.dispatchEvent(event);
  }

  _showMoveTooltip(move, elementId) {
    if (move) {
      window.showTooltip(html`<psr-router-move .move="${move}" detailed></psr-router-move>`, this.shadowRoot.getElementById(elementId));
    }
  }
}

window.customElements.define('psr-router-trainer', PsrRouterTrainer);
export { PsrRouterTrainer };
