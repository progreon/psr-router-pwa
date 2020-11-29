// JS Imports
import { html, property } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { RouteManager } from 'SharedModules/psr-router-route/util';
import { Game } from 'SharedModules/psr-router-model/Game';
import { Route } from 'SharedModules/psr-router-route/Route';
import { GetGameInfos } from 'SharedModules/psr-router-game-factory';

// These are the elements needed by this element.
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-formfield';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-select';
import '@material/mwc-textfield';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field';
import '@vaadin/vaadin-button/theme/material/vaadin-button';
import '@vaadin/vaadin-dialog/theme/material/vaadin-dialog';
import '@vaadin/vaadin-combo-box/theme/material/vaadin-combo-box';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

// Image imports for this element
import { trashIcon } from 'Shared/my-icons';
import { Dialog } from '@material/mwc-dialog';

class PsrRouterHome extends PsrRouterPage {

  @property({ type: Boolean })
  private _loading = false;
  private _newRouteDialog: any;

  private jsonClicked: any;
  private txtClicked: any;
  private cancelClicked: any;

  _render() {
    let route: Route, game: Game;
    try {
      route = RouteManager.GetCurrentRoute();
      game = RouteManager.GetCurrentGame();
    } catch (e) {
      console.error(e);
      window.alert("Unable to get the current route, see console for more details.");
    }
    let savedRoutes = RouteManager.GetSavedRoutesTitles().map(sr => {

      return html`
        <div class="saved-route">
          <div class="title" @click="${this._onSavedRouteOpenClicked.bind(this, sr.id)}">${sr.title}</div>
          <div class="delete" @click="${this._onSavedRouteDeleteClicked.bind(this, sr.id)}">${trashIcon}</div>
        </div>
      `;
    });
    let games = GetGameInfos().map(gi => html`<mwc-list-item value="${gi.key}">${gi.name}</mwc-list-item>`);
    return html`
      ${AppStyles}
      <style>
        .content {
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }

        .page-title {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .current-route {
          background-color: rgba(0, 0, 0, 0.05);
          padding: 5px 10px;
          border-radius: 5px;
          margin: 5px 0px;
        }

        .current-route.clickable {
          cursor: pointer;
        }

        .current-route.clickable:hover {
          background-color: rgba(165, 165, 165, .25);
        }

        .right {
          align-self: flex-end;
        }

        .saved-route {
          display: flex;
          flex: row nowrap;
          margin: 5px 0px;
          align-items: center;
        }

        .saved-route > .title {
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0.05);
          padding: 5px 10px;
          border-radius: 5px;
          flex-grow: 1;
        }

        .saved-route > .title:hover {
          background-color: rgba(165, 165, 165, .25);
        }

        .saved-route > .delete {
          background-color: rgba(255, 0, 0, .66);
          border: none;
          border-radius: 5px;
          cursor: pointer;
          padding: 0px;
          height: var(--app-grid-4x);
          width: var(--app-grid-4x);
          margin-left: 5px;
        }

        .saved-route > .delete:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .saved-route > .delete > svg {
          height: var(--app-grid-2x);
          width: var(--app-grid-2x);
          margin: var(--app-grid-x);
        }

        .manage-routes {
          display: flex;
          flex-direction: column;
          background-color: rgba(0, 0, 0, 0.05);
          padding: 5px 10px;
          border-radius: 5px;
        }

        .button-group {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-top: 4px;
        }

        .button-group > .left {
          width: 50%;
        }

        .button-group > .button {
          width: 50%;
        }

        .button-group > .button.delete {
          color: var(--app-color-error-red);
        }

        .examples {
          display: flex;
          flex-direction: column;
        }

        /* hacking the input button... */
        .input-wrapper {
          position: relative;
          overflow: hidden;
          display: inline-block;
          text-align: center;
        }

        .input-wrapper > vaadin-button {
          width: 100%;
        }

        .input-wrapper input[type=file] {
          position: absolute;
          font-size: 30px;
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

        .dialog {
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }

        h3 {
          margin: 20px 0px 10px 0px;
        }

        h4 {
          margin: 5px 0px;
        }

        hr {
          box-sizing: border-box;
          height: 1px;
          margin: 8px 0px 8px 0px;
          border: 0;
          border-top: 1px solid var(--app-color-black);
        }

        .padding {
          padding-bottom: var(--app-grid-2x);
        }

        @media (min-width: ${window.MyAppGlobals.wideWidth}) {
          .button-group {
            justify-content: space-between;
          }

          .button-group > .left {
            width: 75%;
          }

          .button-group > .button {
            width: 25%;
          }

          .examples {
            display: flex;
            flex-direction: row;
            align-items: center;
          }

          .examples > .left {
            width: 75%;
          }

          .examples > .button {
            width: 25%;
          }
        }
      </style>
      <div class="content">
        <div class="page-title">
          <h1>PSR Router</h1>
          Welcome to PSR Router, a Router for Pokémon SpeedRuns!
        </div>
        <h3>Current Loaded Route</h3>
        <div class="current-route" ?hidden="${!!route}">
          <h4>No route loaded</h4>
        </div>
        <vaadin-button class="right" id="close-route" @click="${this._onCloseRouteClicked}" ?hidden="${!route}">Close Route</vaadin-button>
        <div class="current-route clickable" ?hidden="${!route}" @click="${this._onCurrentRouteClicked}">
          <h4>${route?.info.title}</h4>
          <div ?hidden="${!game?.info.unsupported}">[GAME NOT (fully) SUPPORTED (yet)!]</div>
          <b>Game: Pokémon ${game && game.info.name}</b>
          <div>Generation ${game && game.info.gen || "?"}</div>
          <div>${game && game.info.year || "????"}, ${game && game.info.platform}</div>
        </div>
        <h3>Your Saved Routes</h3>
          <vaadin-button class="right" id="new-route" @click="${this._onNewRouteClicked}">Create a New Route</vaadin-button>
          <div ?hidden="${savedRoutes.length > 0}">You currently don't have any routes saved</div>
          <div class="route-list">
            ${savedRoutes}
          </div>
        <h3>Load an Example Route</h3>
        <div class="manage-routes">
          <div class="examples">
            <vaadin-combo-box id="example-routes" class="left"></vaadin-combo-box>
            <vaadin-button id="load-route" class="button" @click="${this._onLoadRouteClicked}">Load Example</vaadin-button>
          </div>
        </div>
        <h3>Manage Your Routes</h3>
        <div class="manage-routes">
          <i>PSR Router uses the browser's internal storage to keep your saved routes stored in.
          This means you can keep working offline and no logins are needed!
          But that also means there's a plus and downside to this: YOU control your data...
          To help you with this, here are some buttons for you:</i>
          <div class="button-group">
            <div class="left">Export loaded route</div>
            <vaadin-button id="export" class="button" @click="${this._onExportClicked}" ?disabled="${!route}">Export Route</vaadin-button>
          </div>
          <div class="button-group">
            <div class="left">Import a route file</div>
            <div class="input-wrapper button" @mouseenter="${this._onImportFileButtonHover.bind(this, true)}" @mouseleave="${this._onImportFileButtonHover.bind(this, false)}">
              <vaadin-button id="importFile">Import route</vaadin-button>
              <input type="file" id="selFileRoute" name="route" accept=".txt,.json">
            </div>
          </div>
          <div class="button-group">
            <div class="left">Download a full backup</div>
            <vaadin-button id="export" class="button" @click="${this._onBackupClicked}">Backup</vaadin-button>
          </div>
          <div class="button-group">
            <div class="left">Restore a full backup</div>
            <div class="input-wrapper button" @mouseenter="${this._onRestoreButtonHover.bind(this, true)}" @mouseleave="${this._onRestoreButtonHover.bind(this, false)}">
              <vaadin-button id="importBackup">Restore</vaadin-button>
              <input type="file" id="selFileBackup" name="route" accept=".psrrdata">
            </div>
          </div>
          <div class="button-group">
            <div class="left">Clear browser data</div>
            <vaadin-button id="export" class="button delete" @click="${this._onDeleteAllClicked}">Clear All</vaadin-button>
          </div>
        </div>
        <div class="padding"></div>
      </div>

      <vaadin-dialog id="dia-export" style="padding: 0px;">
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

      <!-- TODO: switch to vaadin for now... -->
      <mwc-dialog id="dialog-new" @closed="${(e) => this._resetNewRouteDialog(e)}">
        <div class="dialog">
          <mwc-select id="s-game" label="Game" required validateOnInitialRender naturalMenuWidth>
            ${games}
          </mwc-select>
          <mwc-textfield id="t-title" label="Title" required validateOnInitialRender></mwc-textfield>
        </div>
        <mwc-button slot="primaryAction" @click="${this._onNewRouteOkClicked}">ok</mwc-button>
        <mwc-button dialogAction="cancel" slot="secondaryAction">cancel</mwc-button>
      </mwc-dialog>

      <vaadin-dialog id="dia-new" style="padding: 0px;">
        <template>
          <div class="menu-options">
            <vaadin-text-field id="dia-new-game" label="Game"></vaadin-text-field>
            <vaadin-text-field id="dia-new-title" label="Title"></vaadin-text-field>
            <div class="options">
              <vaadin-button id="menu-json"">JSON</vaadin-button>
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
    this.jsonClicked = this.doExport.bind(this, { toJSON: true });
    this.txtClicked = this.doExport.bind(this, {});
    this.cancelClicked = this.doCancel.bind(this);
  }

  updated(_changedProperties) {
    super.updated(_changedProperties);

    // Import route file button listener
    this._initImportButtonListener();

    // Import backup button listener
    this._initRestoreButtonListener();

    let comboBox: any = this.shadowRoot.getElementById("example-routes");
    if (comboBox && !comboBox.items) {
      comboBox.items = RouteManager.GetExampleRoutesInfo(this._isDevMode());
      comboBox.itemLabelPath = "title";
      comboBox.itemValuePath = "key";
      comboBox.value = comboBox.items[0].key;
    }
  }

  _showUnsupportedToast(gameTitle) {
    super.showAppToast(`Game "Pokémon ${gameTitle}" is not (fully) supported. (YET!)`);
  }

  //// OPEN ROUTE STUFF ////

  _onCurrentRouteClicked() {
    super._navigateTo("router");
  }

  _onCloseRouteClicked() {
    RouteManager.CloseCurrentRoute();
    this.requestUpdate();
  }

  //// SAVED ROUTES STUFF ////

  _resetNewRouteDialog(e) {
    e.cancelbubble = true;
    let dialog: any = this.shadowRoot.getElementById("dialog-new");
    if (e.target == dialog) {
      let sGame: any = this.shadowRoot.getElementById("s-game");
      sGame.value = "";
      let tTitle: any = this.shadowRoot.getElementById("t-title");
      tTitle.value = "";
    }
  }

  _onNewRouteClicked() {
    // TODO: popup for choosing game, title
    let dialog: any = this.shadowRoot.getElementById("dialog-new");
    dialog.show();
    // Hack to make the dropdown show properly
    let sGame: any = this.shadowRoot.getElementById("s-game");
    let innerMenu: any = sGame.shadowRoot.querySelector(".mdc-menu");
    innerMenu.fixed = true;
  }

  _onNewRouteOkClicked() {
    let dialog: any = this.shadowRoot.getElementById("dialog-new");
    let sGame: any = this.shadowRoot.getElementById("s-game");
    let tTitle: any = this.shadowRoot.getElementById("t-title");
    if (sGame.checkValidity() && tTitle.checkValidity()) {
      dialog.close();
      try {
        console.debug("Creating game...", sGame.value, tTitle.value);
        let route = RouteManager.CreateAndOpenNewRoute(sGame.value, tTitle.value);
        if (route.game.info.unsupported) {
          this._showUnsupportedToast(route.game.info.name);
        }
        super._navigateTo("router");
      } catch (e) {
        console.error(e);
        window.alert("Something went wrong while a new route, see console for more details.");
      }
    }
  }

  _onSavedRouteOpenClicked(id: number) {
    try {
      let route = RouteManager.OpenSavedRoute(id);
      if (route.game.info.unsupported) {
        this._showUnsupportedToast(route.game.info.name);
      }
      if (route.getAllMessages().length > 0) {
        let str = route.getAllMessages().map(m => m.toString()).join("\n");
        alert(str);
      }
      super._navigateTo("router");
    } catch (e) {
      console.error(e);
      this.showAppToast("Something went wrong while loading the saved route, see console for more details.");
    }
  }

  _onSavedRouteDeleteClicked(id) {
    RouteManager.DeleteRoute(id);
    this.requestUpdate();
  }

  //// EXAMPLE ROUTES STUFF ////

  _onLoadRouteClicked(e) {
    let comboBox: any = this.shadowRoot.getElementById("example-routes");
    if (comboBox.value) {
      try {
        let route = RouteManager.OpenExampleRoute(comboBox.value);
        if (route.game.info.unsupported) {
          this._showUnsupportedToast(route.game.info.name);
        }
        if (route.getAllMessages().length > 0) {
          let str = route.getAllMessages().map(m => m.toString()).join("\n");
          alert(str);
        }
        super._navigateTo("router");
      } catch (e) {
        console.error(e);
        this.showAppToast("Something went wrong while loading an example route, see console for more details.");
      }
    }
  }

  //// MANAGE ROUTES STUFF ////

  // EXPORT //
  _onExportClicked(e) {
    console.log(e);
    let route = RouteManager.GetCurrentRoute();
    if (route) {
      (<any>this.shadowRoot.getElementById("dia-export")).opened = true;
      // bind menu listeners
      (<any>document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('filename')).value = route.shortname ? route.shortname : route.info.title;
      let menuJson = document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('menu-json');
      menuJson.hidden = !this._isDevMode();
      // menuJson.addEventListener('click', this.jsonClicked);
      menuJson.addEventListener('click', this.doExport.bind(this, { toJSON: true }));
      let menuTxt = document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('menu-txt');
      menuTxt.innerHTML = this._isDevMode() ? "TXT" : "EXPORT";
      menuTxt.addEventListener('click', this.txtClicked);
      document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('menu-cancel').addEventListener('click', this.cancelClicked);
    }
  }

  doExport(printerSettings) {
    let filename = (<any>document.getElementById('overlay').shadowRoot.getElementById('content').shadowRoot.getElementById('filename')).value;
    try {
      RouteManager.ExportRouteFile(filename, printerSettings);
    } catch (e) {
      console.error(e);
      this.showAppToast("Something went wrong while exporting the loaded route, see console for more details.");
    }
    (<any>document.getElementById('overlay')).opened = false;
  }

  doCancel() {
    (<any>document.getElementById('overlay')).opened = false;
  }

  // IMPORT //
  _initImportButtonListener() {
    let fileInputRoute: HTMLInputElement = <HTMLInputElement>this.shadowRoot.getElementById("selFileRoute");
    if (fileInputRoute && !fileInputRoute.onchange) {
      fileInputRoute.onchange = e => {
        this._loading = true;
        RouteManager.OpenRouteFile((<HTMLInputElement>e.target).files[0])
          .then(route => {
            fileInputRoute.value = "";
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
            fileInputRoute.value = "";
            this._loading = false;
            console.warn(e);
            this.showAppToast(e);
            this.requestUpdate();
          });
      }
    }
  }

  _onImportFileButtonHover(setHover: boolean) {
    let importFileButton: any = this.shadowRoot.getElementById("importFile");
    if (setHover) {
      importFileButton.setAttribute("focus-ring", "focus-ring");
    } else {
      importFileButton.removeAttribute("focus-ring");
    }
  }

  // BACKUP //
  _onBackupClicked() {
    console.log("_onBackupClicked");
    try {
      RouteManager.ExportBackup();
    } catch (e) {
      console.error(e);
      this.showAppToast("Something went wrong while exporting the loaded route, see console for more details.");
    }
  }

  // RESTORE //
  _initRestoreButtonListener() {
    // TODO: warn override
    let fileInputBackup: HTMLInputElement = <HTMLInputElement>this.shadowRoot.getElementById("selFileBackup");
    if (fileInputBackup && !fileInputBackup.onchange) {
      fileInputBackup.onchange = e => {
        this._loading = true;
        RouteManager.OpenBackupFile((<HTMLInputElement>e.target).files[0])
          .then(result => {
            fileInputBackup.value = "";
            this._loading = false;
            this.requestUpdate();
          }).catch(e => {
            fileInputBackup.value = "";
            this._loading = false;
            console.warn(e);
            this.showAppToast(e);
            this.requestUpdate();
          });
      }
    }
  }

  _onRestoreButtonHover(setHover: boolean) {
    let importBackupButton: any = this.shadowRoot.getElementById("importBackup");
    if (setHover) {
      importBackupButton.setAttribute("focus-ring", "focus-ring");
    } else {
      importBackupButton.removeAttribute("focus-ring");
    }
  }

  // CLEAR ALL //
  private _deleteDialog: Dialog;
  _onDeleteAllClicked() {
    // TODO: warn deletion
    let games = GetGameInfos().map(gi => html`<mwc-list-item value="${gi.key}">${gi.name}</mwc-list-item>`);
    this._deleteDialog = window.openMwcDialog(html`
      <style>
        .dialog {
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
      </style>
      [TODO]
      <div class="dialog">
        <mwc-select id="s-game" label="Game" required validateOnInitialRender naturalMenuWidth>
          ${games}
        </mwc-select>
        <mwc-textfield id="t-title" label="Title" required validateOnInitialRender></mwc-textfield>
      </div>
      <mwc-button slot="primaryAction" id="btn-ok" @click="${this._onNewRouteOkClicked2.bind(this)}">ok</mwc-button>
      <mwc-button dialogAction="cancel" slot="secondaryAction">cancel</mwc-button>
    `);
  }

  _onNewRouteOkClicked2() {
    let sGame: any = this._deleteDialog.querySelector("#s-game");
    let tTitle: any = this._deleteDialog.querySelector("#t-title");
    if (sGame.checkValidity() && tTitle.checkValidity()) {
      this._deleteDialog.close();
      try {
        console.debug("Creating game...", sGame.value, tTitle.value);
        let route = RouteManager.CreateAndOpenNewRoute(sGame.value, tTitle.value);
        if (route.game.info.unsupported) {
          this._showUnsupportedToast(route.game.info.name);
        }
        super._navigateTo("router");
      } catch (e) {
        console.error(e);
        window.alert("Something went wrong while a new route, see console for more details.");
      }
    }
  }
}

window.customElements.define('psr-router-home', PsrRouterHome);
