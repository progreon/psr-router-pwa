import { html } from '@polymer/lit-element';
import { PsrRouterPage } from 'CoreComponents/psr-router-page/psr-router-page';

// JS imports
import { RouteParser } from 'SharedModules/psr-router-route';

// These are the elements needed by this element.
import '@vaadin/vaadin-button/theme/material/vaadin-button';
import 'SharedComponents/psr-router-route/psr-router-route';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterExample extends PsrRouterPage {
  _render() {
    return html`
      ${AppStyles}
      <style>
        /* ugly solution, I know... */
        /* .padding {
          padding-bottom: var(--app-grid-3x);
        } */
      </style>
      <input type="file" id="selFile" hidden>
      <div class="buttons">
        <vaadin-button id="export" @click="${this.doExport}">Export to file</vaadin-button>
        <vaadin-button id="import" @click="${this.doImport}">Import file</vaadin-button>
      </div>
      <psr-router-route id="the-route" .routeEntry=${this.route}></psr-router-route>
      <!-- <div class="padding"></div> -->
    `;
  }

  static get properties() {
    return {
      /* The route object. */
      route: Object
    };
  }

  doExport(e) {
    this.route.exportToFile("example-route.txt");
  }

  doImport(e) {
    var fileInput = this.shadowRoot.getElementById("selFile");
    var _this = this;
    fileInput.oninput = function(e) {
      var fileReader = new FileReader();
      fileReader.onload = function(e) {
        var route = RouteParser.ParseRouteText(e.target.result);
        console.log(route);
        _this.route = route;
      }
      fileReader.readAsText(e.target.files[0]);
    }
    fileInput.click();
  }
}

window.customElements.define('psr-router-example', PsrRouterExample);
