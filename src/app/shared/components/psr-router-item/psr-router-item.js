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
class PsrRouterItem extends LitElement {
  _render(props) {
    return html`
      ${AppStyles}
      <vaadin-item hidden?="${!props.detailed}">
        <div><strong>${props.item.name} (₽${props.item.price})</strong></div>
        <div>${props.item.type} (${props.item.value})</div>
        <div><i>${props.item.description}</i></div>
      </vaadin-item>
      <vaadin-item hidden?="${props.detailed}">
        <div><strong>${props.item.name}</strong></div>
        <div>₽${props.item.price}</div>
      </vaadin-item>
    `;
  }

  static get properties() {
    return {
      /* The item object. */
      item: Object,
      /* If this element must display more detailed information. */
      detailed: Boolean
    }
  };

  constructor() {
    super();
    this.detailed = false;
  }

  _hasDescription() {
    return this.item.description && this.item.description != null && this.item.description !== "";
  }
}

window.customElements.define('psr-router-item', PsrRouterItem);
