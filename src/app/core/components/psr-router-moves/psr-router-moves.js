import { html } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-move/psr-router-move';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterMoves extends PsrRouterPage {
  _render() {
    // var moves = this.game ? this.game.moves : {};
    var moveElements = [];
    Object.keys(this.moves).sort((a, b) => (a < b ? -1 : (a > b ? 1 : 0))).forEach(m => {
      moveElements.push(html`<psr-router-move id="${m}" .move=${this.moves[m]} detailed></psr-router-move>`);
    });
    return html`
      ${AppStyles}
      <style>
        psr-router-move {
          padding: 0px 5px;
          border-radius: 5px;
        }
        psr-router-move:hover {
          background-color: #bbbbbb;
        }
      </style>
      <h2>Moves</h2>
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
