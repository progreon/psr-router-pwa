// JS imports
import { html, property } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { Item } from 'SharedModules/psr-router-model/Item';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-item/psr-router-item';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterItems extends PsrRouterPage {

  @property({type: Array})
  public items: Item[];

  _render() {
    let itemElements = [];
    for (let i in this.items) {
      itemElements.push(html`<psr-router-item id="${i}" .item=${this.items[i]} detailed></psr-router-item>`);
    }
    return html`
      ${AppStyles}
      <style>
        psr-router-item {
          padding: 0px 5px;
          border-radius: 5px;
        }
        psr-router-item:hover {
          background-color: #bbbbbb;
        }
      </style>
      <h2>Items</h2>
      ${itemElements}
    `;
  }

  constructor() {
    super();
    this.triggerDataRefresh();
  }

  triggerDataRefresh() {
    this.items = window.app && window.app.game && window.app.game.items ? window.app.game.items : {};
  }
}

window.customElements.define('psr-router-items', PsrRouterItems);
