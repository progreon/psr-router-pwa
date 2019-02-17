// Imports for this element
import { LitElement, html } from 'lit-element';

// These are the elements needed by this element.
// import '@vaadin/vaadin-item/vaadin-item';
import '@vaadin/vaadin-item/theme/material/vaadin-item';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class PsrRouterItem extends LitElement {
  render() {
    return html`
      ${AppStyles}
      <vaadin-item ?hidden="${!this.detailed}">
        <div><strong>${this.item.name} (₽${this.item.price})</strong></div>
        <div>[${this.item.usage()}] ${this.item.type} (${this.item.value})</div>
        <div><i>${this.item.description}</i></div>
      </vaadin-item>
      <vaadin-item ?hidden="${this.detailed}">
        <div><strong>${this.item.name}</strong></div>
        <div>₽${this.item.price}</div>
      </vaadin-item>
    `;
  }

  static get properties() {
    return {
      /* The item object. */
      item: Object,
      /* If this element must display more detailed information. */
      detailed: {type: Boolean, reflect: true}
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
