// JS imports
import { html, property } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { Trainer } from 'SharedModules/psr-router-model/Model';

// These are the elements needed by this element.
import '@vaadin/vaadin-item/theme/material/vaadin-item';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterTrainers extends PsrRouterPage {

  @property({type: Array})
  public trainers: Trainer[];

  _render() {
    let trainerElements = [];
    Object.keys(this.trainers).sort((ta, tb) => ta.toString().localeCompare(tb.toString())).forEach(t => {
      let trainer = this.trainers[t];
      trainerElements.push(html`
        <div class="item">
          <vaadin-item id="${t}" @click="${this._onClick.bind(this, trainer)}">
            <div><strong>${trainer.key}</strong></div>
            <div>Exp. Points: ${trainer.getTotalExp()}</div>
            <div ?hidden="${!trainer.alias}">Alias: ${trainer.alias || "-"}</div>
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
          background-color: #bbbbbb;
        }
      </style>
      <h2>Trainers</h2>
      ${trainerElements}
    `;
  }

  constructor() {
    super();
    this.triggerDataRefresh();
  }

  triggerDataRefresh() {
    this.trainers = window.app && window.app.game && window.app.game.trainers ? window.app.game.trainers : {};
  }

  _onClick(trainer: Trainer) {
    super._navigateTo('trainer-info?t=' + trainer.key);
  }
}

window.customElements.define('psr-router-trainers', PsrRouterTrainers);
