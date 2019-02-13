// JS Imports
import { html } from '@polymer/lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { RouteManager } from 'SharedModules/psr-router-route/util';

// These are the elements needed by this element.
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button/theme/material/vaadin-button';
import '@vaadin/vaadin-dialog/theme/material/vaadin-dialog';
import '@vaadin/vaadin-combo-box';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterHome extends PsrRouterPage {
  _render() {
    var route = RouteManager.GetCurrentRoute();
    var game = RouteManager.GetCurrentGame();
    return html`
      ${AppStyles}
      <style>
        /* hacking the input button... */
        .buttons {
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .button-group {
          display: flex;
          flex-direction: row;
        }
        .button-group > * {
          flex-grow: 1;
        }
        .input-wrapper {
          position: relative;
          overflow: hidden;
          display: inline-block;
          text-align: center;
        }
        .input-wrapper input[type=file] {
          position: absolute;
          font-size: 100px;
          opacity: 0;
          left: 0;
          top: 0;
        }
        .menu-options {
          display: flex;
          flex-flow: column;
          align-items: stretch;
        }
        .options {
          display: flex;
        }
        .options > * {
          flex-grow: 1;
        }
        hr {
          width: 100%;
          border-width: 1px 0px 0px 0px;
        }
      </style>
      <h2>Current Route</h2>
      <h3>${route ? route.info.title : "No route loaded"}</h3>
      <p>${route && route.shortname}</p>
      <p ?hidden="${!game || !game.info.unsupported}">[GAME NOT SUPPORTED (YET)]</p>
      <b ?hidden="${!game}">Game: Pokémon ${game && game.info.name}</b>
      <div ?hidden="${!game}">Generation ${game && game.info.gen}</div>
      <div ?hidden="${!game}">${game && game.info.year}, ${game && game.info.platform}</div>
      <hr>
      <!-- <h2>Manage route</h2> -->
      <div class="buttons">
        <div class="button-group">
          <vaadin-button id="export" @click="${this._onExportClicked.bind(this)}" ?disabled="${!route}">Export file</vaadin-button>
          <div class="input-wrapper">
            <vaadin-button id="import">Import file</vaadin-button>
            <input type="file" id="selFile" name="route" accept=".txt,.json">
          </div>
        </div>
        <vaadin-combo-box id="example-routes"></vaadin-combo-box>
        <vaadin-button id="load-route" @click="${this._onLoadRouteClicked.bind(this)}">Load example route</vaadin-button>
      </div>

      <vaadin-dialog id="menu" style="padding: 0px;">
        <template>
          <div class="menu-options">
            <vaadin-text-field id="filename" label="Filename"></vaadin-text-field>
            <div class="options">
              <vaadin-button id="menu-json">JSON</vaadin-button>
              <vaadin-button id="menu-txt">TXT</vaadin-button>
            </div>
            <hr>
            <vaadin-button id="menu-cancel">Cancel</vaadin-button>
          </div>
        </template>
      </vaadin-dialog>
    `;
  }

  constructor() {
    super();
    // menu listeners
    this.jsonClicked = this.doExport.bind(this, {toJSON: true});
    this.txtClicked = this.doExport.bind(this, {});
    this.cancelClicked = this.doCancel.bind(this);
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    let fileInput = this.shadowRoot.getElementById("selFile");
    fileInput.oninput = e => {
      this._loading = true;
      RouteManager.LoadRouteFile(e.target.files[0])
        .then(route => {
          fileInput.value = "";
          this._loading = false;
          if (route.game.info.unsupported) {
            this._showUnsupportedToast(route.game.info.name);
          }
          super._navigateTo("router");
        }).catch(e => {
          fileInput.value = "";
          this._loading = false;
          console.warn(e);
          this.showAppToast(e);
          this.requestUpdate();
        });
    }
    let comboBox = this.shadowRoot.getElementById("example-routes");
    comboBox.items = RouteManager.GetExampleRoutesNames();
    comboBox.value = comboBox.items[0];
  }

  triggerDataRefresh() {
    let comboBox = this.shadowRoot.getElementById("example-routes");
    if (comboBox && comboBox.items && comboBox.items.length) {
      comboBox.value = comboBox.items[0];
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

  doCancel() {
    document.getElementById('overlay').opened = false;
  }

  _onExportClicked(e) {
    var route = RouteManager.GetCurrentRoute();
    if (route) {
      this.shadowRoot.getElementById("menu").opened = true;
      // bind menu listeners
      document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('filename').value = route.shortname ? route.shortname : route.info.title;
      let menuJson = document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('menu-json');
      menuJson.disabled = !this.searchParams.dev;
      menuJson.addEventListener('click', this.jsonClicked);
      document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('menu-txt').addEventListener('click', this.txtClicked);
      document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('menu-cancel').addEventListener('click', this.cancelClicked);
    }
  }

  _onLoadRouteClicked(e) {
    let comboBox = this.shadowRoot.getElementById("example-routes");
    if (comboBox.value) {
      let route = RouteManager.LoadExampleRoute(comboBox.value);
      if (route.game.info.unsupported) {
        this._showUnsupportedToast(route.game.info.name);
      }
      super._navigateTo("router");
    }
  }

  _showImportDialog(e) {
    this.shadowRoot.getElementById('dialog').opened = true;
  }

  _onImportClicked(e) {
    console.log("Importing route file...");
  }

  _showUnsupportedToast(gameTitle) {
    super.showAppToast(`Game "${gameTitle}" is not (fully) supported yet`);
  }
}

window.customElements.define('psr-router-home', PsrRouterHome);
