// JS imports
import { html } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

class PsrRouter404 extends PsrRouterPage {
  _render() {
    return html`
      <section>
        <h2>Oops! You hit a 404</h2>
        <p>The page you're looking for doesn't seem to exist. Head back
           <a href="/home">home</a> and try again?
        </p>
      </section>
    `
  }
}

window.customElements.define('psr-router-404', PsrRouter404);
