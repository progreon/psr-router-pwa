// JS Imports
import { html, css, unsafeCSS, property } from 'lit-element';
import { Dialog } from '@material/mwc-dialog';
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
import '@material/mwc-textfield';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field';
import '@vaadin/vaadin-button/theme/material/vaadin-button';
import 'SharedComponents/psr-router-mwc/psr-router-select';

// Image imports for this element
import { trashIcon } from 'Shared/my-icons';
import { starLineIcon } from 'Shared/my-icons';
import { starSolidIcon } from 'Shared/my-icons';
import { downloadIcon } from 'Shared/my-icons';

class PsrRouterHome extends PsrRouterPage {

  @property({ type: Boolean })
  private _loading = false;

  static get styles() {
    return [
      ...super.styles,
      css`
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
          display: flex;
          flex-flow: row wrap;
          max-width: 100%;
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
          padding: 10px;
          border-radius: 5px;
          flex-grow: 1;
        }

        .saved-route > .title:hover {
          background-color: rgba(165, 165, 165, .25);
        }

        .saved-route > .icon {
          cursor: pointer;
          border: none;
          border-radius: 5px;
          padding: 0px;
          height: var(--app-grid-4x);
          width: var(--app-grid-4x);
          fill: var(--app-dark-text-color);
        }

        .saved-route > .icon > svg {
          height: var(--app-grid-2x);
          width: var(--app-grid-2x);
          margin: var(--app-grid-x);
        }

        .saved-route > .icon:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .saved-route > .fav {
          fill: var(--app-color-yellow);
        }

        .saved-route > .delete {
          background-color: rgba(255, 0, 0, .66);
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

        @media (min-width: ${unsafeCSS(window.MyAppGlobals.wideWidth)}) {
          .saved-route > .icon {
            margin-left: 5px;
          }

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
            flex-grow: 1;
          }

          .examples > .button {
            margin: 0px 20px;
          }
        }
      `
    ];
  }

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
          <div class="icon nofav" @click="${this._onSavedRouteFavoriteClicked.bind(this, sr.id, true)}" ?hidden="${sr.isFav}">${starLineIcon}</div>
          <div class="icon fav" @click="${this._onSavedRouteFavoriteClicked.bind(this, sr.id, false)}" ?hidden="${!sr.isFav}">${starSolidIcon}</div>
          <div class="icon export" @click="${this._onExportClicked.bind(this, sr.id)}">${downloadIcon}</div>
          <div class="icon delete" @click="${this._onSavedRouteDeleteClicked.bind(this, sr.id)}">${trashIcon}</div>
        </div>
      `;
    });
    let examples = RouteManager.GetExampleRoutesInfo(this._isDevMode());
    let examplesDOM = [];
    examples.forEach(e => examplesDOM.push(html`<mwc-list-item .value="${e.key}">${e.title}</mwc-list-item>`));
    return html`
      <div class="content">
        <div class="page-title">
          <h1>PSR Router</h1>
          Welcome to PSR Router, a Router for Pokémon SpeedRuns!
        </div>
        <h3>Open Route</h3>
        <div class="right">
          <div class="input-wrapper button" @mouseenter="${this._onImportFileButtonHover.bind(this, true)}" @mouseleave="${this._onImportFileButtonHover.bind(this, false)}">
            <vaadin-button id="importFile">Import</vaadin-button>
            <input type="file" id="selFileRoute" name="route" accept=".txt,.json">
          </div>
          <vaadin-button id="close-route" @click="${this._onCloseRouteClicked}" ?disabled="${!route}">Close</vaadin-button>
        </div>
        <div class="current-route" ?hidden="${!!route}">
          <h4>No open route</h4>
        </div>
        <div class="current-route clickable" ?hidden="${!route}" @click="${this._onCurrentRouteClicked}">
          <h4>${route?.info.title}</h4>
          <div ?hidden="${!game?.info.unsupported}">[GAME NOT (fully) SUPPORTED (yet)!]</div>
          <b>Game: Pokémon ${game && game.info.name}</b>
          <div>Generation ${game && game.info.gen || "?"}</div>
          <div>${game && game.info.year || "????"}, ${game && game.info.platform}</div>
        </div>
        <h3>Example Routes</h3>
        <div class="manage-routes">
          <div class="examples">
            <psr-router-select id="example-routes" class="left">${examplesDOM}</psr-router-select>
            <vaadin-button id="load-route" class="button" @click="${this._onLoadRouteClicked}">Open</vaadin-button>
          </div>
        </div>
        <h3>Saved Routes</h3>
        <div class="right">
          <vaadin-button id="new-route" @click="${this._onNewRouteClicked}">Create a New Route</vaadin-button>
        </div>
        <div ?hidden="${savedRoutes.length > 0}">You currently don't have any routes saved</div>
        <div class="route-list">
          ${savedRoutes}
        </div>
        <h3>Manage Your Routes</h3>
        <div class="manage-routes">
          <i>PSR Router uses the browser's internal storage to keep your saved routes stored in.
          This means you can keep working offline and no logins are needed!
          But that also means there's a plus and downside to this: YOU control your data...
          To help you with this, here are some buttons for you:</i>
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
    `;
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
    super.app.requestUpdate();
    this.requestUpdate();
  }

  //// SAVED ROUTES STUFF ////

  private _newRouteDialog: Dialog;
  _onNewRouteClicked() {
    let games = GetGameInfos();
    let gamesDOM = [];
    games.forEach(g => gamesDOM.push(html`<mwc-list-item .value="${g.key}">${g.name}</mwc-list-item>`));
    this._newRouteDialog = window.openMwcDialog(html`
      <style>
        .dialog {
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
      </style>
      <div class="dialog">
        <psr-router-select id="s-game" label="Game" withDialogFix required>${gamesDOM}</psr-router-select>
        <vaadin-text-field id="t-title" label="Title" required></vaadin-text-field>
      </div>
      <vaadin-button slot="primaryAction" @click="${this._onNewRouteOkClicked.bind(this)}">Ok</vaadin-button>
      <vaadin-button slot="secondaryAction" dialogAction="cancel">Cancel</vaadin-button>
    `);
  }

  _onNewRouteOkClicked() {
    let dialog = this._newRouteDialog;
    let sGame: any = dialog.querySelector("#s-game");
    let tTitle: any = dialog.querySelector("#t-title");
    sGame.reportValidity();
    tTitle.validate();
    if (sGame.reportValidity() && tTitle.validate()) {
      dialog.close();
      try {
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

  _onSavedRouteFavoriteClicked(id: number, isFavorite: boolean) {
    RouteManager.SetFavoriteRoute(id, isFavorite);
    this.requestUpdate();
  }

  _onSavedRouteDeleteClicked(id) {
    let okListener = () => {
      RouteManager.DeleteRoute(id);
      this.requestUpdate();
      super.app.requestUpdate();
    };

    window.openMwcDialog(html`
      <h3>Delete this saved route?</h3>
      This cannot be undone!
      <vaadin-button dialogAction="ok" slot="primaryAction" id="btn-ok" @click="${okListener.bind(this)}">Ok</vaadin-button>
      <vaadin-button dialogAction="cancel" slot="secondaryAction">Cancel</vaadin-button>
    `);
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
  private _exportDialog: Dialog;
  _onExportClicked(id?: number) {
    let route;
    if (id == null) {
      route = RouteManager.GetCurrentRoute();
    } else {
      route = RouteManager.GetSavedRoute(id);
    }
    if (route) {
      this._exportDialog = window.openMwcDialog(html`
        <style>
          .export-options {
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
            box-sizing: border-box;
            height: 1px;
            margin: 8px 0px 8px 0px;
            border: 0;
            border-top: 1px solid var(--app-color-black);
          }
        </style>
        <div class="export-options">
          <vaadin-text-field id="filename" label="Filename" .value="${route.info.title}"></vaadin-text-field>
          <div class="options">
            <vaadin-button @click="${this.doExport.bind(this, { toJSON: true }, id)}" ?hidden="${!this._isDevMode()}">JSON</vaadin-button>
            <vaadin-button @click="${this.doExport.bind(this, null, id)}">${this._isDevMode() ? "TXT" : "EXPORT"}</vaadin-button>
          </div>
          <hr>
          <vaadin-button dialogAction="cancel" slot="secondaryAction">Cancel</vaadin-button>
        </div>
      `, {
        "hideActions": true
      });
    }
  }

  doExport(printerSettings?: any, id?: number) {
    let filename = (<any>this._exportDialog.querySelector('#filename')).value;
    try {
      RouteManager.ExportRouteFile(filename, printerSettings, id);
    } catch (e) {
      console.error(e);
      this.showAppToast("Something went wrong while exporting the loaded route, see console for more details.");
    }
    this._exportDialog.close();
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
            super.app.requestUpdate();
            this.requestUpdate();
          }).catch(e => {
            fileInputBackup.value = "";
            this._loading = false;
            console.warn(e);
            this.showAppToast(e);
            super.app.requestUpdate();
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
  _onDeleteAllClicked() {
    let okListener = () => {
      RouteManager.ClearAllData();
      this.requestUpdate();
      super.app.requestUpdate();
    };

    window.openMwcDialog(html`
      <h3>Clear all data?</h3>
      This will remove all the routes from this browser!
      <vaadin-button dialogAction="ok" slot="primaryAction" id="btn-ok" @click="${okListener.bind(this)}">Ok</vaadin-button>
      <vaadin-button dialogAction="cancel" slot="secondaryAction">Cancel</vaadin-button>
    `);
  }
}

window.customElements.define('psr-router-home', PsrRouterHome);
