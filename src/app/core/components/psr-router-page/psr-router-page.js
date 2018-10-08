import { LitElement } from '@polymer/lit-element';

export class PsrRouterPage extends LitElement {
  static get properties() {
    return {
      active: {type: Boolean, reflect: true},
      game: Object,
      searchParams: Object
    }
  }

  // Only render this page if it's actually visible.
  render() {
    console.log("render", this.active);
    if (this.active) {
      return this._render();
    }
  }

  _navigateTo(href, isExternalLink) {
    const navigateEvent = new CustomEvent('navigate', { detail: {href: href, external: isExternalLink}});
    document.body.dispatchEvent(navigateEvent);
  }

  _render() {
    // Implement this!
  }
}
