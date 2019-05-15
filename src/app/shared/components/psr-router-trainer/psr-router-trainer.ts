// Imports for this element
import { LitElement, html, property } from 'lit-element';

// These are the elements needed by this element.
// import '@vaadin/vaadin-item/vaadin-item';
import '@vaadin/vaadin-item/theme/material/vaadin-item';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';
import { Trainer } from 'App/shared/modules/psr-router-model/Model';

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class PsrRouterTrainer extends LitElement {

  @property({type: Trainer})
  public trainer: Trainer;

  render() {
    let party = [];
    if (this.trainer) {
      this.trainer.party.forEach(b => {
        let ms = b.moveset;
        party.push(html`
          <div class="column">
            <h2 class="pokemon" @click="${this._onPokemonClicked.bind(this, b.pokemon.name)}">${b.pokemon.name} - L${b.level}</h2>
            <div class="center">${b.getExp()} exp. points</div>
            <div><div>${ms[0]}</div><div>${ms[1]}</div></div>
            <div><div>${ms[2]}</div><div>${ms[3]}</div></div>
          </div>`);
      });
    }

    return html`
    ${AppStyles}
    <style>
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
      h1, h2, h3 {
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
    </style>

    <div class="flex-container">
      <h1>${this.trainer ? this.trainer.name : ""}</h1>
      <h3 ?hidden="${!this.trainer || !this.trainer.alias}"><i>${this.trainer ? this.trainer.alias : ""}</i></h3>
      <h3>${this.trainer ? this.trainer.location : ""}</h3>
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
}

window.customElements.define('psr-router-trainer', PsrRouterTrainer);
export { PsrRouterTrainer };
