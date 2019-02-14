import { html } from '@polymer/lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-pokemon/psr-router-pokemon';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterPokemonList extends PsrRouterPage {
  _render() {
    // var pokemon = this.game ? this.game.pokemon : {};
    var pokemonElements = [];
    for (var p in this.pokemon) {
      var name = this.pokemon[p].name;
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

  static get properties() {
    return {
      /* The pokemon array. */
      pokemon: Array
    };
  }

  constructor() {
    super();
    this.triggerDataRefresh();
  }

  triggerDataRefresh() {
    this.pokemon = window.app && window.app.game && window.app.game.pokemon ? window.app.game.pokemon : {};
  }

  _onClick(pokemon) {
    super._navigateTo('pokemon-info?p=' + pokemon.name);
  }
}

window.customElements.define('psr-router-pokemon-list', PsrRouterPokemonList);
