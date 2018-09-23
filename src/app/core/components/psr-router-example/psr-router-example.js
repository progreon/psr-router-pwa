import { html } from '@polymer/lit-element';
import { PsrRouterPage } from 'CoreComponents/psr-router-page/psr-router-page';

// JS imports
import { ParseRouteText } from 'SharedModules/psr-router-route-parser';

// These are the elements needed by this element.
import '@vaadin/vaadin-button/theme/material/vaadin-button';
import 'SharedComponents/psr-router-route/psr-router-route-entry';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterExample extends PsrRouterPage {
  _render(props) {
    return html`
      ${AppStyles}
      <input type="file" id="selFile" hidden>
      <div class="buttons">
        <vaadin-button id="export" on-click="${e => this.doExport(e)}">Export to file</vaadin-button>
        <vaadin-button id="import" on-click="${e => this.doImport(e)}">Import file</vaadin-button>
      </div>
      <psr-router-route-entry id="the-route" routeEntry=${props.route}></psr-router-route-entry>
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
    fileInput.oninput = function(e) {
      // console.log("oninput", e.target.files);
      // console.log(ParseRouteFile(fileInput.files[0]));
      var fileReader = new FileReader();
      fileReader.onload = function(e) {
        console.log(ParseRouteText(e.target.result));
      }
      fileReader.readAsText(e.target.files[0]);
    }
    fileInput.click();
    // console.log(fileInput);
    // var parsedRoute = ParseRouteFile(fileInput.files[0]);
  }
}

window.customElements.define('psr-router-example', PsrRouterExample);
