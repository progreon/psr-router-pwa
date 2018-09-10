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
  _render(props) {
    var typeString = props.pokemon.type1 + (props.pokemon.type2 ? ", " + props.pokemon.type2 : "");

    return html`
      ${AppStyles}
      <vaadin-item on-click=${e => this._onClick(e)}>
        <div><strong>${props.pokemon.id} - ${props.pokemon.name}</strong></div>
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
