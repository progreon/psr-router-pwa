import { html } from '@polymer/lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-pokemon/psr-router-pokemon';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterPokemonList extends PsrRouterPage {
  _render() {
    var pokemon = this.game ? this.game.pokemon : {};
    var pokemonElements = [];
    for (var p in pokemon) {
      var name = pokemon[p].name;
      pokemonElements.push(html`<psr-router-pokemon id="${p}" .pokemon=${pokemon[p]} @click="${e => this._onClick(e.detail.pokemon)}"></psr-router-pokemon>`);
    }
    return html`
      ${AppStyles}
      ${pokemonElements}
    `;
  }

  static get properties() {
    return {
      /* The items array. */
      test: Array
    };
  }

  constructor() {
    super();
  }

  _onClick(pokemon) {
    super._navigateTo('pokemon-info?p=' + pokemon.name);
  }
}

window.customElements.define('psr-router-pokemon-list', PsrRouterPokemonList);
