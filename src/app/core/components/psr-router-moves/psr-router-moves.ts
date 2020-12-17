// JS imports
import { html, property, css } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { Move } from 'SharedModules/psr-router-model/move/Move';
import { RouteManager } from 'SharedModules/psr-router-route/util';

// These are the elements needed by this element.
import '@material/mwc-textfield';
import 'SharedComponents/psr-router-move/psr-router-move';

class PsrRouterMoves extends PsrRouterPage {

  @property({type: Array})
  public moves: { [key: string]: Move };
  private filteredMoves: { [key: string]: Move };

  static get styles() {
    return css`
      ${super.styles}
      psr-router-move {
        padding: 0px 5px;
        border-radius: 5px;
      }
      psr-router-move:hover {
        background-color: rgba(0, 0, 0, 0.15);
      }
      #search {
        width: 100%;
      }
    `;
  }

  _render() {
    let moveElements = [];
    this._filter();
    Object.keys(this.filteredMoves).sort((a, b) => (a < b ? -1 : (a > b ? 1 : 0))).forEach(m => {
      moveElements.push(html`<psr-router-move id="${m}" .move=${this.filteredMoves[m]} detailed></psr-router-move>`);
    });
    return html`
      <h2>Moves</h2>
      <mwc-textfield id="search" label="Search" @input="${() => this.requestUpdate()}"></mwc-textfield>
      ${moveElements}
    `;
  }

  constructor() {
    super();
    this.triggerDataRefresh();
  }

  triggerDataRefresh() {
    let game = RouteManager.GetCurrentGame();
    this.moves = game?.moves || {};
  }

  _filter() {
    let filterNode: any = this.shadowRoot.getElementById("search");
    let filters: string[] = (filterNode?.value?.toUpperCase() || "").split(" ");
    this.filteredMoves = {};
    for (let i in this.moves) {
      this.filteredMoves[i] = this.moves[i];
    }
    filters.forEach(filter => {
      for (let i in this.filteredMoves) {
        let move: Move = this.filteredMoves[i];
        if (!!filter && !move.key.toUpperCase().includes(filter) && !move.name.toUpperCase().includes(filter)) {
          delete this.filteredMoves[i];
        }
      }
    });
  }
}

window.customElements.define('psr-router-moves', PsrRouterMoves);
