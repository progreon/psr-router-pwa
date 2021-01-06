// JS imports
import { html, property, css } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { Pokemon } from 'SharedModules/psr-router-model/ModelAbstract';
import { RouteManager } from 'SharedModules/psr-router-route/util';

// These are the elements needed by this element.
import '@material/mwc-textfield';
import 'SharedComponents/psr-router-pokemon/psr-router-pokemon';

class PsrRouterPokemonList extends PsrRouterPage {

  @property({type: Array})
  public pokemon: { [key: string]: Pokemon };
  private filteredPokemon: { [key: string]: Pokemon };

  static get styles() {
    return css`
      ${super.styles}
      psr-router-pokemon {
        cursor: pointer;
        padding: 0px 5px;
        border-radius: 5px;
      }
      psr-router-pokemon:hover {
        background-color: rgba(0, 0, 0, 0.15);
      }
      #search {
        width: 100%;
      }
    `;
  }

  _render() {
    let pokemonElements = [];
    this._filter();
    for (let p in this.filteredPokemon) {
      pokemonElements.push(html`<psr-router-pokemon id="${p}" .pokemon=${this.filteredPokemon[p]} @click="${e => this._onClick(e.detail.pokemon)}"></psr-router-pokemon>`);
    }
    return html`
      <h2>Pokémon</h2>
      <mwc-textfield id="search" label="Search" @input="${() => this.requestUpdate()}"></mwc-textfield>
      ${pokemonElements}
    `;
  }

  constructor() {
    super();
    this.triggerDataRefresh();
  }

  triggerDataRefresh() {
    let game = RouteManager.GetCurrentGame();
    this.pokemon = game?.pokemon || {};
  }

  _filter() {
    let filterNode: any = this.shadowRoot.getElementById("search");
    let filters: string[] = (filterNode?.value?.toUpperCase() || "").split(" ");
    this.filteredPokemon = {};
    for (let i in this.pokemon) {
      this.filteredPokemon[i] = this.pokemon[i];
    }
    filters.forEach(filter => {
      for (let i in this.filteredPokemon) {
        let pokemon: Pokemon = this.filteredPokemon[i];
        if (!!filter && !pokemon.key.toUpperCase().includes(filter) && !pokemon.name.toUpperCase().includes(filter)) {
          delete this.filteredPokemon[i];
        }
      }
    });
  }

  _onClick(pokemon: Pokemon) {
    super._navigateTo('pokemon-info?p=' + pokemon.name);
  }
}

window.customElements.define('psr-router-pokemon-list', PsrRouterPokemonList);
