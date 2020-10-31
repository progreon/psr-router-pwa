// JS imports
import { html, property } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { Trainer } from 'SharedModules/psr-router-model/Model';

// These are the elements needed by this element.
import '@vaadin/vaadin-item/theme/material/vaadin-item';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterTrainers extends PsrRouterPage {

  @property({type: Array})
  public trainers: { [key: string]: Trainer };
  private filteredTrainers: { [key: string]: Trainer };

  _render() {
    let trainerElements = [];
    this._filter();
    // TODO: sort by alias, name, location
    // TODO: show name, location instead of key
    Object.keys(this.filteredTrainers).sort((ta, tb) => ta.toString().localeCompare(tb.toString())).forEach(t => {
      let trainer: Trainer = this.filteredTrainers[t];
      trainerElements.push(html`
        <div class="item">
          <vaadin-item id="${t}" @click="${this._onClick.bind(this, trainer)}">
            <div><strong>${trainer.key}</strong></div>
            <div>Exp. Points: ${trainer.getTotalExp()}</div>
            <div ?hidden="${!trainer.alias}">Alias: ${trainer.alias || "-"}</div>
            <div class="key" style="opacity: 0.5"><i>[key: ${trainer.key}]</i></div>
          </vaadin-item>
        </div>
      `);
    });
    // for (let t in this.trainers) {
    //   let trainer = this.trainers[t];
    //   trainerElements.push(html`
    //     <vaadin-item id="${t}" @click="${this._onClick.bind(this, trainer)}">
    //       <div><strong>${trainer.key}</strong></div>
    //       <div>Exp. Points: ${trainer.getTotalExp()}</div>
    //       <div ?hidden="${!trainer.alias}">Alias: ${trainer.alias || "-"}</div>
    //     </vaadin-item>
    //   `);
    // }
    return html`
      ${AppStyles}
      <style>
        .item {
          cursor: pointer;
          padding: 0px 5px;
          border-radius: 5px;
        }
        .item:hover {
          background-color: rgba(0, 0, 0, 0.15);
        }
        #search {
          width: 100%;
        }
      </style>
      <h2>Trainers</h2>
      <vaadin-text-field id="search" label="Search" clear-button-visible @input="${() => this.requestUpdate()}"></vaadin-text-field>
      ${trainerElements}
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
    this.trainers = window.app && window.app.game && window.app.game.trainers ? window.app.game.trainers : {};
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
