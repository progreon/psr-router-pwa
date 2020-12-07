// Imports for this element
import { LitElement, html, property } from 'lit-element';
import { Item } from 'SharedModules/psr-router-model/Item';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class PsrRouterItem extends LitElement {

  @property({type: Item})
  public item: Item;
  @property({type: Boolean, reflect: true})
  public detailed: boolean = true;

  render() {
    return html`
      ${AppStyles}
      <style>
        .item {
          padding: 5px 0px;
        }
      </style>
      <div class="item" ?hidden="${!this.detailed}">
        <div><strong>${this.item.name}</strong></div>
        <div><i>${this.item.description}</i></div>
        <div>₽${this.item.price}</div>
        <div>[${this.item.usage}] ${this.item.type} (${this.item.value})</div>
        <div class="key" style="opacity: 0.5"><i>[key: ${this.item.key}]</i></div>
      </div>
      <div class="item" ?hidden="${this.detailed}">
        <div><strong>${this.item.name}</strong></div>
        <div>₽${this.item.price}</div>
      </div>
    `;
  }

  constructor() {
    super();
    this.detailed = false;
  }

  _hasDescription(): boolean {
    return this.item.description && this.item.description != null && this.item.description !== "";
  }
}

window.customElements.define('psr-router-item', PsrRouterItem);
