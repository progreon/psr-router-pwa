import { html } from '@polymer/lit-element';
import { PsrRouterPage } from 'CoreComponents/psr-router-page/psr-router-page';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-route/psr-router-route-entry';
import { GetDummyRoute } from 'SharedModules/psr-router-route-factory';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterExample extends PsrRouterPage {
  _render(props) {
    // var entries = props.route ? props.route.getEntryList() : [];
    // var entryElements = [];
    // for (var i = 0; i < entries.length; i++)
    //   entryElements.push(html`<psr-router-route-entry id="${'entry-' + i}" routeEntry=${entries[i]}></psr-router-route-entry>`);

    return html`
      ${AppStyles}
      <psr-router-route-entry id="the-route" routeEntry=${props.route}></psr-router-route-entry>
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
    this.route = GetDummyRoute(super.game);
    console.log('Example route:', this.route);
  }
}

window.customElements.define('psr-router-example', PsrRouterExample);
