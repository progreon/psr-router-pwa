// JS imports
import { html, property, css } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { Item } from 'SharedModules/psr-router-model/Item';
import { RouteManager } from 'SharedModules/psr-router-route/util';

// These are the elements needed by this element.
// import '@material/mwc-icon';
import '@material/mwc-textfield';
import 'SharedComponents/psr-router-item/psr-router-item';

class PsrRouterItems extends PsrRouterPage {

  @property({type: Object})
  public items: { [key: string]: Item };
  private filteredItems: { [key: string]: Item };

  static get styles() {
    return css`
      ${super.styles}
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
    `;
  }

  _render() {
    let itemElements = [];
    this._filter();
    for (let i in this.filteredItems) {
      itemElements.push(html`<psr-router-item id="${i}" .item=${this.filteredItems[i]} detailed></psr-router-item>`);
    }
    return html`
      <h2>Items</h2>
      <!-- <mwc-icon>shopping_cart</mwc-icon> -->
      <mwc-textfield id="search" label="Search" @input="${() => this.requestUpdate()}"></mwc-textfield>
      ${itemElements}
    `;
  }

  constructor() {
    super();
    this.triggerDataRefresh();
  }

  triggerDataRefresh() {
    let game = RouteManager.GetCurrentGame();
    this.items = game?.items || {};
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
