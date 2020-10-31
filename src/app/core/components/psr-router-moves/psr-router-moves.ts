// JS imports
import { html, property } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { Move } from 'SharedModules/psr-router-model/move/Move';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-move/psr-router-move';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterMoves extends PsrRouterPage {

  @property({type: Array})
  public moves: { [key: string]: Move };
  private filteredMoves: { [key: string]: Move };

  _render() {
    let moveElements = [];
    this._filter();
    Object.keys(this.filteredMoves).sort((a, b) => (a < b ? -1 : (a > b ? 1 : 0))).forEach(m => {
      moveElements.push(html`<psr-router-move id="${m}" .move=${this.filteredMoves[m]} detailed></psr-router-move>`);
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
        #search {
          width: 100%;
        }
      </style>
      <h2>Moves</h2>
      <vaadin-text-field id="search" label="Search" clear-button-visible @input="${() => this.requestUpdate()}"></vaadin-text-field>
      ${moveElements}
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
    this.moves = window.app && window.app.game && window.app.game.moves ? window.app.game.moves : {};
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
