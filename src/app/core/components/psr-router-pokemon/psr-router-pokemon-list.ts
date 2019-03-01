// JS imports
import { html, property } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { Pokemon } from 'SharedModules/psr-router-model/ModelAbstract';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-pokemon/psr-router-pokemon';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterPokemonList extends PsrRouterPage {

  @property({type: Array})
  public pokemon: Pokemon[];

  _render() {
    let pokemonElements = [];
    for (let p in this.pokemon) {
      pokemonElements.push(html`<psr-router-pokemon id="${p}" .pokemon=${this.pokemon[p]} @click="${e => this._onClick(e.detail.pokemon)}"></psr-router-pokemon>`);
    }
    return html`
      ${AppStyles}
      <style>
        psr-router-pokemon {
          cursor: pointer;
          padding: 0px 5px;
          border-radius: 5px;
        }
        psr-router-pokemon:hover {
          background-color: #bbbbbb;
        }
      </style>
      <h2>Pokémon</h2>
      ${pokemonElements}
    `;
  }

  constructor() {
    super();
    this.triggerDataRefresh();
  }

  triggerDataRefresh() {
    this.pokemon = window.app && window.app.game && window.app.game.pokemon ? window.app.game.pokemon : {};
  }

  _onClick(pokemon: Pokemon) {
    super._navigateTo('pokemon-info?p=' + pokemon.name);
  }
}

window.customElements.define('psr-router-pokemon-list', PsrRouterPokemonList);
