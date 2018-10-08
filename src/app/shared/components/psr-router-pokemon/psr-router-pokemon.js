// Imports for this element
import { LitElement, html } from '@polymer/lit-element';

// These are the elements needed by this element.
// import '@vaadin/vaadin-item/vaadin-item';
import '@vaadin/vaadin-item/theme/material/vaadin-item';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class PsrRouterPokemon extends LitElement {
  render() {
    var typeString = this.pokemon.type1 + (this.pokemon.type2 ? ", " + this.pokemon.type2 : "");

    return html`
      ${AppStyles}
      <vaadin-item @click=${this._onClick}>
        <div><strong>${this.pokemon.id} - ${this.pokemon.name}</strong></div>
        <div>${typeString}</div>
      </vaadin-item>
    `;
  }

  static get properties() {
    return {
      /* The pokemon object. */
      pokemon: Object
    }
  };

  constructor() {
    super();
  }

  _onClick(e) {
    e.cancelBubble = true;
    this.dispatchEvent(new CustomEvent('click', { bubbles: true, detail: {pokemon: this.pokemon}}));
  }
}

window.customElements.define('psr-router-pokemon', PsrRouterPokemon);
