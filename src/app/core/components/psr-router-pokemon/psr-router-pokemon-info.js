import { html } from '@polymer/lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { RouteManager } from 'SharedModules/psr-router-route/util';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-pokemon/psr-router-pokemon';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterPokemonInfo extends PsrRouterPage {
  _render() {
    let game = RouteManager.GetCurrentGame();
    let pokemon = game && game.findPokemonByName(this.searchParams.p) || {};
    let moveLevels = [];
    let moveNames = [];
    if (pokemon.defaultMoves) {
      pokemon.defaultMoves.forEach(m => {moveLevels.push(html`<div>0</div>`); moveNames.push(html`<div>${m}</div>`)});
    }
    if (pokemon.learnedMoves) {
      Object.keys(pokemon.learnedMoves).forEach(l => {moveLevels.push(html`<div>${l}</div>`); moveNames.push(html`<div>${pokemon.learnedMoves[l]}</div>`)});
    }
    if (pokemon.tmMoves) {
      pokemon.tmMoves.forEach(m => {
        moveLevels.push(html`<div>${m}</div>`);
        moveNames.push(html`<div>${game.findItemByName(m).value}</div>`)
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
        h1, h2, .type {
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
        <!-- <h1>[img]</h1> -->
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
        <!-- <div class="section">
          <h2>Evolution</h2>
        </div>
        <div class="section">
          <h2>Locations</h2>
        </div> -->
        <div class="section">
          <h2>Moves</h2>
          <div class="h-table">
            <div class="column header">
              ${moveLevels}
            </div>
            <div class="column">
              ${moveNames}
            </div>
          </div>
        </div>
        <div class="section" ?hidden="${this._isGen(window.app.game, 1)}">
          <h2>Breeding</h2>
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
    return game && game.info.gen === gen;
  }
}

window.customElements.define('psr-router-pokemon-info', PsrRouterPokemonInfo);
