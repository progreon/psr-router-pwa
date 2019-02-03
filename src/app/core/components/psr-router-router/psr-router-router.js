import { html } from '@polymer/lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

// JS imports
import { RouteParser, RouteManager } from 'SharedModules/psr-router-route/util';
import * as Route from 'SharedModules/psr-router-route';

// These are the elements needed by this element.
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button/theme/material/vaadin-button';
import '@vaadin/vaadin-dialog/theme/material/vaadin-dialog';
import 'SharedComponents/psr-router-route/psr-router-route';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterRouter extends PsrRouterPage {
  _render() {
    return html`
      ${AppStyles}
      <style>
        /* hacking the input button... */
        .buttons {
          display: flex;
        }
        .input-wrapper {
          position: relative;
          overflow: hidden;
          display: inline-block;
        }
        .input-wrapper input[type=file] {
          position: absolute;
          font-size: 100px;
          opacity: 0;
          left: 0;
          top: 0;
        }
        /* ugly solution, I know... */
        /* .padding {
          padding-bottom: var(--app-grid-3x);
        } */

        .menu-options {
          display: flex;
          flex-flow: column;
          /* align-items: center; */
        }
        .menu-options > * {
          align-self: center;
        }
      </style>
      <div class="buttons">
        <vaadin-button id="export" @click="${this._onExportClicked.bind(this)}">Export to file</vaadin-button>
        <div class="input-wrapper">
          <vaadin-button id="import">Import file</vaadin-button>
          <input type="file" id="selFile" name="route" accept=".txt,.json">
        </div>
        <vaadin-button id="load-route" @click="${this._onLoadRouteClicked.bind(this)}">Load route</vaadin-button>
      </div>
      <psr-router-route id="the-route" class="noselect" .routeEntry=${this.route}></psr-router-route>
      <!-- <div class="padding"></div> -->

      <vaadin-dialog id="menu" style="padding: 0px;">
        <template>
          <div class="menu-options">
            <vaadin-text-field id="filename"></vaadin-text-field>
            <vaadin-button id="menu-json" ?disabled="${!super.searchParams.dev}">JSON</vaadin-button>
            <vaadin-button id="menu-txt">TXT</vaadin-button>
          </div>
        </template>
      </vaadin-dialog>
    `;
  }

  static get properties() {
    return {
      /* The route object. */
      route: Object,
      _loading: {
        type: Boolean,
        value: false
      }
    };
  }

  constructor() {
    super();
    // menu listeners
    this.jsonClicked = this.doExport.bind(this, {toJSON: true});
    this.txtClicked = this.doExport.bind(this, {});
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.route = window.app.route;
    var fileInput = this.shadowRoot.getElementById("selFile");
    fileInput.oninput = e => {
      this._loading = true;
      RouteManager.LoadRouteFile(e.target.files[0])
        .then(route => {
          this.route = route;
          fileInput.value = "";
          this._loading = false;
        }).catch(e => {
          this._loading = false;
        });
    }
  }

  _onInput(e) {
    console.log("_onInput", this, e);
  }

  doExport(printerSettings) {
    var filename = document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('filename').value;
    RouteManager.ExportRouteFile(filename, printerSettings, this.route);
    document.getElementById('overlay').opened = false;
  }

  _onExportClicked(e) {
    if (this.route) {
      this.shadowRoot.getElementById("menu").opened = true;
      // bind menu listeners
      document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('filename').value = this.route.shortname ? this.route.shortname : this.route.info.title;
      document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('menu-json').addEventListener('click', this.jsonClicked);
      document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('menu-txt').addEventListener('click', this.txtClicked);
    }
  }

  _onLoadRouteClicked(e) {
    this.route = RouteManager.LoadExampleRoute("red_god_nido_basic");
  }

  _showImportDialog(e) {
    this.shadowRoot.getElementById('dialog').opened = true;
  }

  _onImportClicked(e) {
    console.log("Importing route file...");
  }
}

window.customElements.define('psr-router-router', PsrRouterRouter);
