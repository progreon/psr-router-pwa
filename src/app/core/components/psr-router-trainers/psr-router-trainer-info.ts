// JS imports
import { html } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';
import { RouteManager } from 'SharedModules/psr-router-route/util';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-trainer/psr-router-trainer';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PsrRouterTrainerInfo extends PsrRouterPage {
  _render() {
    let game = RouteManager.GetCurrentGame();
    let trainer = game && game.findTrainerByKeyOrAlias(this.searchParams.t);
    return html`
      ${AppStyles}
      <psr-router-trainer .trainer="${trainer}"></psr-router-trainer>
    `;
  }

  constructor() {
    super();
  }
}

window.customElements.define('psr-router-trainer-info', PsrRouterTrainerInfo);
