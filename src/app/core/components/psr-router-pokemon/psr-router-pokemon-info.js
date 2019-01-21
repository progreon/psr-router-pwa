import { html } from '@polymer/lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-pokemon/psr-router-pokemon';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterPokemonInfo extends PsrRouterPage {
  _render() {
    var pokemon = window.app.game.findPokemonByName(this.searchParams.p) || {};
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
        .flex-container > h1, .flex-container > .type {
          align-self: center;
        }
        .flex-container > .section {
          flex-direction: column;
          border-top: 1px solid gray;
        }
        .flex-container > .section > * {
          margin: 0px;
          display: flex;
        }
        .v-table {
          display: flex;
          flex-direction: column;
        }
        .v-table > .row {
          display: flex;
        }
        .v-table > .header {
          font-weight: bold;
        }
        .v-table > .row > * {
          flex: 1;
          text-align: center;
        }
        .h-table {
          display: flex;
        }
        .h-table > .column {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .h-table > .header {
          font-weight: bold;
        }
        .h-table > .column > * {
          text-align: left;
          margin-left: 5px;
        }
        .h-table > .header > * {
          text-align: right;
          margin-right: 5px;
        }
      </style>

      <div class="flex-container">
        <h1>[img]</h1>
        <h1>#${this._parseIdString(pokemon.id)} ${pokemon.name}</h1>
        <div class="type">
          <div>${pokemon.type1}</div>
          <div ?hidden="${!pokemon.type2}">, ${pokemon.type2}</div>
        </div>
        <div class="section">
          <h2>Base Stats</h2>
          <div class="v-table">
            <div class="row header">
              <div>HP</div><div>Atk</div><div>Def</div><div>Spd</div><div>Spc</div>
            </div>
            <div class="row">
              <div>${pokemon.hp}</div><div>${pokemon.atk}</div><div>${pokemon.def}</div>
              <div>${pokemon.spd}</div><div>${pokemon.spc}</div>
            </div>
          </div>
        </div>
        <div class="section">
          <h2>Training</h2>
          <div class="h-table">
            <div class="column header">
              <div>Base Exp</div><div>Capture Rate</div>
              <div>Growth Rate</div><div>Base Happiness</div>
            </div>
            <div class="column">
              <div>${pokemon.expGiven}</div><div>&nbsp</div>
              <div>${pokemon.expGroup}</div><div>&nbsp</div>
            </div>
          </div>
        </div>
        <div class="section">
          <h2>Evolutions</h2>
        </div>
        <div class="section" ?hidden="${this._isGen(window.app.game, 1)}">
          <h2>Breeding</h2>
        </div>
        <div class="section">
          <paper-button raised>Locations</paper-button>
          <paper-button raised>Moves</paper-button>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      /* The pokemon object. */
      _pokemon: Object
    };
  }

  constructor() {
    super();
  }

  _parseIdString(id) {
    if (id < 10) {
      return '00' + id;
    } else if (id < 100) {
      return '0' + id;
    } else {
      return id;
    }
  }

  _isGen(game, gen) {
    return game.info.gen === gen;
  }
}

window.customElements.define('psr-router-pokemon-info', PsrRouterPokemonInfo);
