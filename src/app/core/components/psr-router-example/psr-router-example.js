import { html } from '@polymer/lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

// JS imports
import { RouteParser } from 'SharedModules/psr-router-route/util';

// These are the elements needed by this element.
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
          align-items: center;
        }
      </style>
      <div class="buttons">
        <vaadin-button id="export" @click="${this._onExportClicked.bind(this)}">Export to file</vaadin-button>
        <div class="input-wrapper">
          <vaadin-button id="import">Import file</vaadin-button>
          <input type="file" id="selFile" name="route" accept=".txt">
        </div>
      </div>
      <psr-router-route id="the-route" class="noselect" .routeEntry=${this.route}></psr-router-route>
      <!-- <div class="padding"></div> -->

      <vaadin-dialog id="menu" style="padding: 0px;">
        <template>
          <div class="menu-options">
            <vaadin-button class="menu-option" id="menu-json">JSON</vaadin-button>
            <vaadin-button class="menu-option" id="menu-txt">TXT</vaadin-button>
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
      fileReader.onload = function(e) {
        var route = RouteParser.ParseRouteText(e.target.result);
        _this.route = route;
        console.log("route.getJSONObject:", _this.route.getJSONObject());
        console.log("route:", _this.route);
      }
      fileReader.readAsText(e.target.files[0]);
    }
  }

  _onInput(e) {
    console.log("_onInput", this, e);
  }

  doExport(printerSettings) {
    console.log("doExport", printerSettings);
    console.log("Exporting to route file...");
    this.route.exportToFile("example-route", printerSettings);
    document.getElementById('overlay').opened = false;
  }

  _onExportClicked(e) {
    this.shadowRoot.getElementById("menu").opened = true;
    // bind menu listeners
    document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('menu-json').addEventListener('click', this.jsonClicked);
    document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('menu-txt').addEventListener('click', this.txtClicked);

    // this.doExport(e);
  }

  _showImportDialog(e) {
    this.shadowRoot.getElementById('dialog').opened = true;
  }

  _onImportClicked(e) {
    console.log("Importing route file...");
  }

  // doImport(e) {
  //   var fileInput = this.shadowRoot.getElementById("selFile");
  //   var _this = this;
  //   fileInput.oninput = function(e) {
  //     var fileReader = new FileReader();
  //     fileReader.onload = function(e) {
  //       var route = RouteParser.ParseRouteText(e.target.result);
  //       console.log(route);
  //       _this.route = route;
  //     }
  //     fileReader.readAsText(e.target.files[0]);
  //   }
  //   console.log(fileInput);
  //   // fileInput.click();
  // }
}

window.customElements.define('psr-router-example', PsrRouterExample);
