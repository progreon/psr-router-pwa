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
class PsrRouterMove extends LitElement {
  render() {
    return html`
      ${AppStyles}
      <vaadin-item ?hidden="${!this.detailed}">
        <div><strong>${this.move.name} (${this.move.type.name}, ${this.move.category})</strong></div>
        <div>power: ${this.move.power}, accuracy: ${this.move.accuracy}%, ${this.move.pp}pp</div>
        <div>effect: ${this.move.effect}</div>
        <div><i>${this.move.description}</i></div>
      </vaadin-item>
      <vaadin-item ?hidden="${this.detailed}">
        <div><strong>${this.move.name} (${this.move.type})</strong></div>
        <div><i>${this.move.description}</i></div>
      </vaadin-item>
    `;
  }

  static get properties() {
    return {
      /* The move object. */
      move: Object,
      /* If this element must display more detailed information. */
      detailed: {type: Boolean, reflect: true}
    }
  };

  constructor() {
    super();
    this.detailed = false;
  }

  _hasDescription() {
    return this.move.description && this.move.description != null && this.move.description !== "";
  }
}

window.customElements.define('psr-router-move', PsrRouterMove);
