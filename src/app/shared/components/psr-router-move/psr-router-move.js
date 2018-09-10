// Imports for this element
import { LitElement, html } from '@polymer/lit-element';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class PsrRouterMove extends LitElement {
  _render(props) {
    return html`
      ${AppStyles}
      <style></style>
      <vaadin-item hidden?="${!props.detailed}">
        <div><strong>${props.move.name} (${props.move.type}, ${props.move.category})</strong></div>
        <div>${props.move.power} / ${props.move.accuracy}% / ${props.move.pp}pp / ${props.move.effect}</div>
        <div>${props.move.description}</div>
      </vaadin-item>
      <vaadin-item hidden?="${props.detailed}">
        <div><strong>${props.move.name} (${props.move.type})</strong></div>
        <div>${props.move.description}</div>
      </vaadin-item>
    `;
  }

  static get properties() {
    return {
      /* The move object. */
      move: Object,
      /* If this element must display more detailed information. */
      detailed: Boolean
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
