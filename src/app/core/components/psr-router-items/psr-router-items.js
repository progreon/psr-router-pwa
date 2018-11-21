import { html } from '@polymer/lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-item/psr-router-item';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterItems extends PsrRouterPage {
  _render() {
    var items = this.game ? this.game.items : {};
    var itemElements = [];
    for (var i in items) {
      itemElements.push(html`<psr-router-item id="${i}" .item=${items[i]} detailed></psr-router-item>`);
    }
    return html`
      ${AppStyles}
      ${itemElements}
    `;
  }

  static get properties() {
    return {
      /* The items array. */
      test: Array
    };
  }

  constructor() {
    super();
  }
}

window.customElements.define('psr-router-items', PsrRouterItems);
