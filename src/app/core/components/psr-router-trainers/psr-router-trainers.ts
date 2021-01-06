// JS imports
import { html, property, css } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { Trainer } from 'SharedModules/psr-router-model/Model';
import { RouteManager } from 'SharedModules/psr-router-route/util';

// These are the elements needed by this element.
import '@material/mwc-textfield';

class PsrRouterTrainers extends PsrRouterPage {

  @property({ type: Array })
  public trainers: { [key: string]: Trainer };
  private filteredTrainers: { [key: string]: Trainer };

  static get styles() {
    return css`
      ${super.styles}
      .item {
        cursor: pointer;
        padding: 5px;
        border-radius: 5px;
      }
      .item:hover {
        background-color: rgba(0, 0, 0, 0.15);
      }
      #search {
        width: 100%;
      }
    `;
  }

  _render() {
    let trainerElements = [];
    this._filter();
    Object.keys(this.filteredTrainers)
      .map(t => this.filteredTrainers[t])
      .sort((ta, tb) => ta.toString().localeCompare(tb.toString()))
      .forEach(trainer => {
        let divAlias = trainer.alias ? html`<div>Alias: ${trainer.alias}</div>` : [];
        let divItems = trainer.items && trainer.items.length > 0 ? html`<div>Gives item: ${trainer.items.join(", ")}</div>` : [];
        trainerElements.push(html`
          <div class="item" @click="${this._onClick.bind(this, trainer)}">
            <div><strong>${trainer.toString()}</strong></div>
            <div>Exp. Points: ${trainer.getTotalExp()}</div>
            <div>Name: ${trainer.name}</div>
            <div>Location: ${trainer.location}</div>
            ${divAlias}
            ${divItems}
            <div class="key" style="opacity: 0.5"><i>[key: ${trainer.key}]</i></div>
          </div>
        `);
      });

    return html`
      <h2>Trainers</h2>
      <mwc-textfield id="search" label="Search" @input="${() => this.requestUpdate()}"></mwc-textfield>
      ${trainerElements}
    `;
  }

  constructor() {
    super();
    this.triggerDataRefresh();
  }

  triggerDataRefresh() {
    let game = RouteManager.GetCurrentGame();
    this.trainers = game?.trainers || {};
  }

  _filter() {
    let filterNode: any = this.shadowRoot.getElementById("search");
    let filters: string[] = (filterNode?.value?.toUpperCase() || "").split(" ");
    this.filteredTrainers = {};
    for (let i in this.trainers) {
      this.filteredTrainers[i] = this.trainers[i];
    }
    filters.forEach(filter => {
      for (let i in this.filteredTrainers) {
        let trainers: Trainer = this.filteredTrainers[i];
        if (!!filter && !trainers.key.toUpperCase().includes(filter)
          && !trainers.name.toUpperCase().includes(filter)
          && !trainers.alias?.toUpperCase()?.includes(filter)
          && !trainers.location.toUpperCase().includes(filter)) {
          delete this.filteredTrainers[i];
        }
      }
    });
  }

  _onClick(trainer: Trainer) {
    super._navigateTo('trainer-info?t=' + trainer.key);
  }
}

window.customElements.define('psr-router-trainers', PsrRouterTrainers);
