// JS imports
import { html, css, property } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { RouteManager } from 'SharedModules/psr-router-route/util';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-pokemon/psr-router-pokemon';
import 'SharedComponents/psr-router-move/psr-router-move';

class PsrRouterPokemonInfo extends PsrRouterPage {
  @property({ type: String })
  private pokemon: string;

  static get styles() {
    return css`
      ${super.styles}
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
        border-top: 1px solid var(--app-dark-text-color);
        padding-bottom: 10px;
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
    `;
  }

  _render() {
    let game = RouteManager.GetCurrentGame();
    let pokemon = game && game.findPokemonByName(this.pokemon);
    let moveLevels = [];
    let moveNames = [];
    let evolutionKeys = [];
    let evolutionValues = [];
    if (pokemon) {
      pokemon.levelupMoves.forEach((lm, lmi) => {
        moveLevels.push(html`<div>${lm.level}</div>`);
        moveNames.push(html`<div id=${`lm-${lmi}`} style="cursor: pointer;" @mouseenter="${e => this._showMoveTooltip(lm.move, `lm-${lmi}`)}">${lm.move}</div>`);
      });
      pokemon.tms.forEach((tm, tmi) => {
        moveLevels.push(html`<div>${tm}</div>`);
        let move = game.findMoveByName(tm.value);
        moveNames.push(html`<div id=${`tm-${tmi}`} style="cursor: pointer;" @mouseenter="${e => this._showMoveTooltip(move, `tm-${tmi}`)}">${move}</div>`);
      });
      Object.keys(pokemon.evolutions).forEach(key => {
        let value = pokemon.evolutions[key];
        evolutionKeys.push(html`<div>${value.evolutionKey}</div>`);
        evolutionValues.push(html`<div style="cursor: pointer;" @click="${this._onEvolutionClicked.bind(this, value.pokemon)}">${value.pokemon}</div>`);
      });
    }
    return html`
      <div class="flex-container">
        <!-- <h1>[img]</h1> -->
        <h1>#${this._parseIdString(pokemon?.id)} ${pokemon?.name}</h1>
        <div class="type">
          <div>${pokemon?.type1}</div>
          <div ?hidden="${!pokemon?.type2}">, ${pokemon?.type2}</div>
        </div>
        <div class="section">
          <h2>Base Stats</h2>
          <div class="v-table">
            <div class="row header">
              <div>HP</div><div>Atk</div><div>Def</div><div>Spd</div><div>Spc</div>
            </div>
            <div class="row">
              <div>${pokemon?.hp}</div><div>${pokemon?.atk}</div><div>${pokemon?.def}</div>
              <div>${pokemon?.spd}</div><div>${pokemon?.spcAtk}</div>
            </div>
          </div>
        </div>
        <div class="section">
          <h2>Training</h2>
          <div class="h-table">
            <div class="column header">
              <div>Base Exp</div><div>Capture Rate</div>
              <div>Growth Rate</div><div ?hidden="${this._isGen.bind(this, window.app.game, 1)}">Base Happiness</div>
            </div>
            <div class="column">
              <div>${pokemon?.expGiven}</div><div>[TODO]</div>
              <div>${pokemon?.expGroup}</div><div ?hidden="${this._isGen.bind(this, window.app.game, 1)}">&nbsp</div>
            </div>
          </div>
        </div>
        <div class="section">
          <h2>Evolutions</h2>
          <div class="h-table">
            <div class="column header">
              ${evolutionKeys}
            </div>
            <div class="column">
              ${evolutionValues}
            </div>
          </div>
        </div>
        <!-- <div class="section">
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
        <div class="section" ?hidden="${this._isGen.bind(this, window.app.game, 1)}">
          <h2>Breeding</h2>
        </div>
      </div>
    `;
  }

  constructor() {
    super();
  }

  firstUpdated(_changedProperties: any) {
    super.firstUpdated(_changedProperties);
    this.triggerDataRefresh();
  }

  triggerDataRefresh() {
    this.pokemon = this.searchParams.p;
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

  _onEvolutionClicked(pokemon) {
    super._navigateTo('pokemon-info?p=' + pokemon.name);
  }

  _showMoveTooltip(move, elementId) {
    if (move) {
      window.showTooltip(html`<psr-router-move .move="${move}" detailed></psr-router-move>`, this.shadowRoot.getElementById(elementId));
    }
  }
}

window.customElements.define('psr-router-pokemon-info', PsrRouterPokemonInfo);
