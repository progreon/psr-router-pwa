// JS imports
import { html, property } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { Item } from 'SharedModules/psr-router-model/Item';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-item/psr-router-item';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterItems extends PsrRouterPage {

  @property({type: Object})
  public items: { [key: string]: Item };
  private filteredItems: { [key: string]: Item };

  _render() {
    let itemElements = [];
    this._filter();
    for (let i in this.filteredItems) {
      itemElements.push(html`<psr-router-item id="${i}" .item=${this.filteredItems[i]} detailed></psr-router-item>`);
    }
    return html`
      ${AppStyles}
      <style>
        psr-router-item {
          padding: 0px 5px;
          border-radius: 5px;
        }
        psr-router-item:hover {
          background-color: rgba(0, 0, 0, 0.15);
        }
        #search {
          width: 100%;
        }
      </style>
      <h2>Items</h2>
      <vaadin-text-field id="search" label="Search" clear-button-visible @input="${() => this.requestUpdate()}"></vaadin-text-field>
      ${itemElements}
    `;
  }

  constructor() {
    super();
    this.triggerDataRefresh();
  }

  updated(_changedProperties) {
    super.updated(_changedProperties);
    this.shadowRoot.getElementById("search")?.focus();
  }

  triggerDataRefresh() {
    this.items = window.app && window.app.game && window.app.game.items ? window.app.game.items : {};
  }

  _filter() {
    let filterNode: any = this.shadowRoot.getElementById("search");
    let filters: string[] = (filterNode?.value?.toUpperCase() || "").split(" ");
    this.filteredItems = {};
    for (let i in this.items) {
      this.filteredItems[i] = this.items[i];
    }
    filters.forEach(filter => {
      for (let i in this.filteredItems) {
        let item: Item = this.filteredItems[i];
        if (!!filter && !item.key.toUpperCase().includes(filter) && !item.name.toUpperCase().includes(filter)) {
          delete this.filteredItems[i];
        }
      }
    });
  }
}

window.customElements.define('psr-router-items', PsrRouterItems);
