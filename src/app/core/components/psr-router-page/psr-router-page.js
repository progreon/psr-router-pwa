import { LitElement, html } from 'lit-element';

export class PsrRouterPage extends LitElement {
  static get properties() {
    return {
      active: {type: Boolean, reflect: true},
      app: Object
    }
  }

  get searchParams() {
    return this.app.searchParams;
  }

  // Only render this page if it's actually visible.
  render() {
    if (this.active) {
      return this._render();
    }
  }

  showAppToast(text) {
    this.app.showToast(html`<div style="display: flex;">${text}</div>`);
  }

  triggerDataRefresh() {
    // Implement this!
  }

  _navigateTo(href, isExternalLink) {
    const navigateEvent = new CustomEvent('navigate', { detail: {href: href, external: isExternalLink}});
    document.body.dispatchEvent(navigateEvent);
  }

  _render() {
    // Implement this!
  }
}
