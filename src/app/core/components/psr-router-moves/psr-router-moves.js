import { html } from '@polymer/lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-move/psr-router-move';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterMoves extends PsrRouterPage {
  _render() {
    // var moves = this.game ? this.game.moves : {};
    var moveElements = [];
    for (var m in this.moves) {
      moveElements.push(html`<psr-router-move id="${m}" .move=${this.moves[m]} detailed></psr-router-move>`);
    }
    return html`
      ${AppStyles}
      ${moveElements}
    `;
  }

  static get properties() {
    return {
      /* The moves array. */
      moves: Array
    };
  }

  constructor() {
    super();
    this.triggerDataRefresh();
  }

  triggerDataRefresh() {
    this.moves = window.app && window.app.game && window.app.game.moves ? window.app.game.moves : {};
  }
}

window.customElements.define('psr-router-moves', PsrRouterMoves);
