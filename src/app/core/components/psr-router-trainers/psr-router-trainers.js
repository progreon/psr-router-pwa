import { html } from '@polymer/lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

// These are the elements needed by this element.
import '@vaadin/vaadin-item/theme/material/vaadin-item';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterTrainers extends PsrRouterPage {
  _render() {
    // var trainers = this.game ? this.game.trainers : {};
    var trainerElements = [];
    for (var t in this.trainers) {
      var trainer = this.trainers[t];
      trainerElements.push(html`
        <vaadin-item id="${t}" @click="${this._onClick.bind(this, trainer)}">
          <div><strong>${trainer.key}</strong></div>
          <div>alias: ${trainer.alias || "-"}</div>
        </vaadin-item>
      `);
    }
    return html`
      ${AppStyles}
      <style>
        vaadin-item {
          cursor: pointer;
          padding: 0px 5px;
        }
        vaadin-item:hover {
          background-color: #bbbbbb;
        }
      </style>
      <h2>Trainers</h2>
      ${trainerElements}
    `;
  }

  static get properties() {
    return {
      /* The trainers array. */
      trainers: Array
    };
  }

  constructor() {
    super();
    this.triggerDataRefresh();
  }

  triggerDataRefresh() {
    this.trainers = window.app && window.app.game && window.app.game.trainers ? window.app.game.trainers : {};
  }

  _onClick(trainer) {
    super._navigateTo('trainer-info?t=' + trainer.key);
  }
}

window.customElements.define('psr-router-trainers', PsrRouterTrainers);
