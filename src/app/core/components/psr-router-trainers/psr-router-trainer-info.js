import { html } from '@polymer/lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-pokemon/psr-router-pokemon';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterTrainerInfo extends PsrRouterPage {
  _render() {
    var trainer = window.app.game.findTrainerByKeyOrAlias(this.searchParams.t) || {};
    var party = [];
    trainer.party.forEach(b => {
      party.push(html`<div class="column">`);
      party.push(html`<h2 @click="${this._onPokemonClicked.bind(this, b.getPokemon().name)}">${b.getPokemon().name} - L${b.getLevel()}</h2>`);
      b.getMoveset().forEach(m => {
        party.push(html`<div>${m}</div>`);
      });
      party.push(html`</div>`);
    });
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
        .flex-container > h1, .flex-container > h3 {
          align-self: center;
        }
        .flex-container > .section {
          flex-direction: column;
          border-top: 1px solid gray;
          width: 100%;
        }
        .flex-container > .section > * {
          margin: 0px;
          display: flex;
          align-self: center;
        }
        .column {
          display: flex;
          flex-direction: column;
        }
      </style>

      <div class="flex-container">
        <h1>${trainer.name}</h1>
        <h3 ?hidden="${!trainer.alias}"><i>${trainer.alias}</i></h3>
        <h3>${trainer.location}</h3>
        <div class="section">
          ${party}
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
    };
  }

  constructor() {
    super();
  }

  _onPokemonClicked(pokemon) {
    super._navigateTo('pokemon-info?p=' + pokemon);
  }
}

window.customElements.define('psr-router-trainer-info', PsrRouterTrainerInfo);
