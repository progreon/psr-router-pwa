import { html } from '@polymer/lit-element';
import { PsrRouterPage } from 'CoreComponents/psr-router-page/psr-router-page';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles.js';

class PsrRouter404 extends PsrRouterPage {
  _render(props) {
    return html`
      ${AppStyles}
      <section>
        <h2>Oops! You hit a 404</h2>
        <p>The page you're looking for doesn't seem to exist. Head back
           <a href="/">home</a> and try again?
        </p>
      </section>
    `
  }
}

window.customElements.define('psr-router-404', PsrRouter404);
