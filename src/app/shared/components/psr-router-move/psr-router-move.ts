// Imports for this element
import { LitElement, html, css, property } from 'lit-element';
import { Move } from 'App/shared/modules/psr-router-model/move/Move';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class PsrRouterMove extends LitElement {

  @property({type: Move})
  public move: Move;
  @property({type: Boolean, reflect: true})
  public detailed: boolean = true;

  static styles = css`
    ${AppStyles}
    .move {
      padding: 5px 0px;
    }
  `;

  render() {
    return html`
      <div class="move" ?hidden="${!this.detailed}">
        <div><strong>${this.move.name} (${this.move.type.name}, ${this.move.category})</strong></div>
        <div><i>${this.move.description}</i></div>
        <div>Power: ${this.move.power}, accuracy: ${this.move.accuracy}%, PP: ${this.move.pp}</div>
        <div>Effect: ${this.move.effect}</div>
        <div class="key" style="opacity: 0.5"><i>[key: ${this.move.key}]</i></div>
      </div>
      <div class="move" ?hidden="${this.detailed}">
        <div><strong>${this.move.name} (${this.move.type})</strong></div>
        <div><i>${this.move.description}</i></div>
      </div>
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
