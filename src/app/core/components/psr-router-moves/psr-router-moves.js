import { html } from '@polymer/lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-move/psr-router-move';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterMoves extends PsrRouterPage {
  _render() {
    var moves = this.game ? this.game.moves : {};
    var moveElements = [];
    for (var m in moves) {
      moveElements.push(html`<psr-router-move id="${m}" .move=${moves[m]} detailed></psr-router-move>`);
    }
    return html`
      ${AppStyles}
      ${moveElements}
    `;
  }

  static get properties() {
    return {
      /* The moves array. */
      test: Array
    };
  }

  constructor() {
    super();
  }
}

window.customElements.define('psr-router-moves', PsrRouterMoves);
