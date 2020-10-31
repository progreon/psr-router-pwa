// Imports for this element
import { LitElement, html, property } from 'lit-element';

// These are the elements needed by this element.
// import '@vaadin/vaadin-item/vaadin-item';
import '@vaadin/vaadin-item/theme/material/vaadin-item';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';
import { Move } from 'App/shared/modules/psr-router-model/move/Move';

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class PsrRouterMove extends LitElement {

  @property({type: Move})
  public move: Move;
  @property({type: Boolean, reflect: true})
  public detailed: boolean = true;

  render() {
    return html`
      ${AppStyles}
      <vaadin-item ?hidden="${!this.detailed}">
        <div><strong>${this.move.name} (${this.move.type.name}, ${this.move.category})</strong></div>
        <div><i>${this.move.description}</i></div>
        <div>Power: ${this.move.power}, accuracy: ${this.move.accuracy}%, PP: ${this.move.pp}</div>
        <div>Effect: ${this.move.effect}</div>
        <div class="key" style="opacity: 0.5"><i>[key: ${this.move.key}]</i></div>
      </vaadin-item>
      <vaadin-item ?hidden="${this.detailed}">
        <div><strong>${this.move.name} (${this.move.type})</strong></div>
        <div><i>${this.move.description}</i></div>
      </vaadin-item>
    `;
  }

  constructor() {
    super();
    this.detailed = false;
  }

  _hasDescription() {
    return this.move.description && this.move.description != null && this.move.description !== "";
  }
}

window.customElements.define('psr-router-move', PsrRouterMove);
