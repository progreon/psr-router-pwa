import { html } from '@polymer/lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

// JS imports
import { RouteParser, RouteIO } from 'SharedModules/psr-router-route/util';

// These are the elements needed by this element.
import '@vaadin/vaadin-text-field';
import '@vaadin/vaadin-button/theme/material/vaadin-button';
import '@vaadin/vaadin-dialog/theme/material/vaadin-dialog';
import 'SharedComponents/psr-router-route/psr-router-route';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterExample extends PsrRouterPage {
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
      </div>
      <psr-router-route id="the-route" class="noselect" .routeEntry=${this.route}></psr-router-route>
      <!-- <div class="padding"></div> -->

      <vaadin-dialog id="menu" style="padding: 0px;">
        <template>
          <div class="menu-options">
            <vaadin-text-field id="filename"></vaadin-text-field>
            <vaadin-button id="menu-json">JSON</vaadin-button>
            <vaadin-button id="menu-txt">TXT</vaadin-button>
          </div>
        </template>
      </vaadin-dialog>
    `;
  }

  static get properties() {
    return {
      /* The route object. */
      route: Object
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
    var fileInput = this.shadowRoot.getElementById("selFile");
    var _this = this;
    fileInput.oninput = function(e) {
      var fileReader = new FileReader();
      var filename = fileInput.value;
      fileReader.onload = function(e) {
        var route = RouteIO.ImportFromFile(e.target.result, filename.search(/\.json$/) > 0, filename);
        _this.route = route;
        console.debug("route.getJSONObject:", _this.route.getJSONObject());
        console.debug("route:", _this.route);
      }
      fileReader.readAsText(e.target.files[0]);
    }
  }

  _onInput(e) {
    console.log("_onInput", this, e);
  }

  doExport(printerSettings) {
    console.log("doExport", printerSettings);
    var filename = document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('filename').value;
    console.log("Exporting to route file...", filename);
    RouteIO.ExportToFile(this.route, filename, printerSettings);
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

  _showImportDialog(e) {
    this.shadowRoot.getElementById('dialog').opened = true;
  }

  _onImportClicked(e) {
    console.log("Importing route file...");
  }
}

window.customElements.define('psr-router-example', PsrRouterExample);
