// JS imports
import { html, property } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { Move } from 'SharedModules/psr-router-model/move/Move';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-move/psr-router-move';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterMoves extends PsrRouterPage {

  @property({type: Array})
  public moves: Move[];

  _render() {
    let moveElements = [];
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
          background-color: rgba(0, 0, 0, 0.15);
        }
      </style>
      <h2>Moves</h2>
      ${moveElements}
    `;
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
