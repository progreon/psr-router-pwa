// JS imports
import { customElement, html, css, property } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { RouteManager, RouteParser } from 'SharedModules/psr-router-route/util';
import * as Route from 'SharedModules/psr-router-route';

// These are the elements needed by this element.
import '@vaadin/vaadin-button/theme/material/vaadin-button';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-area';

@customElement('psr-router-router-text')
class PsrRouterRouterText extends PsrRouterPage {

  @property({ type: String })
  private _routeText: string;
  @property({ type: Boolean })
  private _changed: boolean;

  static get styles() {
    return [
      ...super.styles,
      css`
        .content {
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .text {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          border: 1px solid rgba(0, 0, 0, .2);
          padding: 10px;
          margin: 0px 10px 10px 10px;
        }
        .right {
          display: flex;
          flex-flow: row wrap;
          max-width: 100%;
          align-self: flex-end;
        }
      `
    ];
  }

  _render() {
    return html`
      <div class="content">
        <div class="right">
          <vaadin-button id="cancel" @click="${this._cancelClicked}">Cancel</vaadin-button>
          <vaadin-button id="save" ?disabled="${!this._changed}" @click="${this._saveClicked}">Save</vaadin-button>
        </div>
        <vaadin-text-area id="route-text" class="text" .value="${this._routeText}" @keydown="${this._onKeyDown}"
          @input="${this._onInput}"></vaadin-text-area>
      </div>
    `;
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._loadRoute();
  }

  triggerDataRefresh() {
    this._loadRoute();
  }

  private _loadRoute() {
    try {
      let route = RouteManager.GetCurrentRoute();
      if (route) {
        this._routeText = RouteParser.ExportRouteText(route.getJSONObject(), { lineEnding: "\n" });
        this._changed = !RouteManager.IsCurrentRouteLocallySaved();
      }
    } catch (e) {
      console.error(e);
      window.alert("Unable to get the current route, see console for more details.");
    }
  }

  private _onInput(e) {
    this._routeText = (<any>this.shadowRoot.getElementById("route-text")).value;
    this._changed = true;
  }

  private _onKeyDown(e: KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      let textArea: any = this.shadowRoot.getElementById("route-text");
      let cursor = textArea.focusElement.selectionStart;
      this._routeText = this._routeText.substr(0, cursor) + "\t" + this._routeText.substr(cursor, this._routeText.length);
      this.updateComplete.then(() => {
        textArea.focusElement.selectionEnd = cursor + 1;
      });
      this._changed = true;
    } else if (e.key === "s" && e.ctrlKey) {
      e.preventDefault();
      this._saveClicked();
    } else if (e.key === "Escape") {
      // TODO: warning if changed
      this._cancelClicked();
    }
  }

  private _saveClicked() {
    if (this._changed) {
      try {
        let json = RouteParser.ParseRouteText(this._routeText, "line");
        let newRoute = Route.Route.newFromJSONObject(json);
        let messages = newRoute.getAllMessages();
        if (messages.length > 0) {
          let lines = [];
          messages.forEach(m => lines.push(html`${m.toString()}<br>`));
          super.showAppToast(lines);
        } else {
          RouteManager.SaveRoute(newRoute, true);
          super._navigateTo("router");
        }
      } catch (e) {
        console.error(e);
        super.showAppToast("error");
      }
    }
  }

  private _cancelClicked() {
    super._navigateTo("router");
  }
}
