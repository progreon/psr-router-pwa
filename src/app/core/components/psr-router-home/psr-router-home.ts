// JS Imports
import { html, property } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { RouteManager } from 'SharedModules/psr-router-route/util';

// These are the elements needed by this element.
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field';
import '@vaadin/vaadin-button/theme/material/vaadin-button';
import '@vaadin/vaadin-dialog/theme/material/vaadin-dialog';
import '@vaadin/vaadin-combo-box/theme/material/vaadin-combo-box';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterHome extends PsrRouterPage {

  @property({type: Boolean})
  private _loading = false;

  private jsonClicked: any;
  private txtClicked: any;
  private cancelClicked: any;

  _render() {
    let route = RouteManager.GetCurrentRoute();
    let game = RouteManager.GetCurrentGame();
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
      <vaadin-button @click="${this._switchTheme.bind(this)}">Switch theme</vaadin-button>
      <h2>Current Route</h2>
      <h3>${route ? route.info.title : "No route loaded"}</h3>
      <p>${route && route.shortname}</p>
      <p ?hidden="${!game || !game.info.unsupported}">[GAME NOT (fully) SUPPORTED (yet)!]</p>
      <b ?hidden="${!game}">Game: Pokémon ${game && game.info.name}</b>
      <div ?hidden="${!game}">Generation ${game && game.info.gen || "?"}</div>
      <div ?hidden="${!game}">${game && game.info.year || "????"}, ${game && game.info.platform}</div>
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
  }

  updated(_changedProperties) {
    super.updated(_changedProperties);
    let fileInput: HTMLInputElement = <HTMLInputElement>this.shadowRoot.getElementById("selFile");
    if (fileInput && !fileInput.onchange) {
      fileInput.onchange = e => {
        this._loading = true;
        RouteManager.LoadRouteFile((<HTMLInputElement>e.target).files[0])
          .then(route => {
            fileInput.value = "";
            this._loading = false;
            if (route.game.info.unsupported) {
              this._showUnsupportedToast(route.game.info.name);
            }
            if (route.getAllMessages().length > 0) {
              let str = route.getAllMessages().map(m => m.toString()).join("\n");
              alert(str);
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
    }
    let comboBox: any = this.shadowRoot.getElementById("example-routes");
    if (comboBox && !comboBox.items) {
      comboBox.items = RouteManager.GetExampleRoutesNames();
      comboBox.value = comboBox.items[0];
    }
  }

  _onInput(e) {
    console.log("_onInput", this, e);
  }

  doExport(printerSettings) {
    let filename = (<any>document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('filename')).value;
    RouteManager.ExportRouteFile(filename, printerSettings);
    (<any>document.getElementById('overlay')).opened = false;
  }

  doCancel() {
    (<any>document.getElementById('overlay')).opened = false;
  }

  _onExportClicked(e) {
    console.log(e);
    let route = RouteManager.GetCurrentRoute();
    if (route) {
      (<any>this.shadowRoot.getElementById("menu")).opened = true;
      // bind menu listeners
      (<any>document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('filename')).value = route.shortname ? route.shortname : route.info.title;
      let menuJson = document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('menu-json');
      menuJson.hidden = !this.searchParams.dev;
      menuJson.addEventListener('click', this.jsonClicked);
      let menuTxt = document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('menu-txt');
      menuTxt.innerHTML = this.searchParams.dev ? "TXT" : "EXPORT";
      menuTxt.addEventListener('click', this.txtClicked);
      document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('menu-cancel').addEventListener('click', this.cancelClicked);
    }
  }

  _onLoadRouteClicked(e) {
    let comboBox: any = this.shadowRoot.getElementById("example-routes");
    if (comboBox.value) {
      let route = RouteManager.LoadExampleRoute(comboBox.value);
      if (route.game.info.unsupported) {
        this._showUnsupportedToast(route.game.info.name);
      }
      if (route.getAllMessages().length > 0) {
        let str = route.getAllMessages().map(m => m.toString()).join("\n");
        alert(str);
      } else {
        super._navigateTo("router");
      }
    }
  }

  _showImportDialog(e) {
    (<any>this.shadowRoot.getElementById('dialog')).opened = true;
  }

  _onImportClicked(e) {
    console.log("Importing route file...");
  }

  _showUnsupportedToast(gameTitle) {
    super.showAppToast(`Game "Pokémon ${gameTitle}" is not (fully) supported. (YET!)`);
  }

  _switchTheme() {
    let theme = window.localStorage.getItem("app-theme") || "light";
    if (theme === "light") {
      theme = "dark";
    } else {
      theme = "light";
    }
    window.localStorage.setItem("app-theme", theme);
    window.location.reload();
  }
}

window.customElements.define('psr-router-home', PsrRouterHome);
