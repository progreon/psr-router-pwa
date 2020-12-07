// Imports for this element
import { LitElement, html, property } from 'lit-element';
import { Pokemon } from 'App/shared/modules/psr-router-model/ModelAbstract';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class PsrRouterPokemon extends LitElement {

  @property({type: Pokemon})
  public pokemon: Pokemon;

  render() {
    let typeString = this.pokemon.type1 + (this.pokemon.type2 ? ", " + this.pokemon.type2 : "");

    return html`
      ${AppStyles}
      <style>
        .pokemon {
          padding: 5px 0px;
        }
      </style>
      <div class="pokemon" @click=${this._onClick}>
        <div><strong>${this.pokemon.id} - ${this.pokemon.name}</strong></div>
        <div>${typeString}</div>
        <div class="key" style="opacity: 0.5"><i>[key: ${this.pokemon.key}]</i></div>
      </div>
    `;
  }

  constructor() {
    super();
  }

  _onClick(e) {
    e.cancelBubble = true;
    this.dispatchEvent(new CustomEvent('click', { bubbles: true, detail: {pokemon: this.pokemon}}));
  }
}

window.customElements.define('psr-router-pokemon', PsrRouterPokemon);
