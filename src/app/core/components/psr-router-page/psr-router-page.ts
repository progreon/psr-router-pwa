// JS imports
import { LitElement, html, property, TemplateResult } from 'lit-element';
import { PsrRouterApp } from 'App/psr-router-app';

export abstract class PsrRouterPage extends LitElement {
  @property({type: Boolean, reflect: true})
  public active: boolean;
  @property({type: Object})
  public app: PsrRouterApp;

  get searchParams() {
    return this.app.searchParams;
  }

  // Only render this page if it's actually visible.
  render(): TemplateResult {
    if (this.active) {
      return this._render();
    } else {
      return undefined;
    }
  }

  public showAppToast(text: any) {
    this.app.showToast(html`<div style="display: flex;">${text}</div>`);
  }

  public triggerDataRefresh() {
    // Implement this!
  }

  protected _isDevMode() {
    return this.app.isDevMode;
  }

  protected _navigateTo(href: string, isExternalLink: boolean = false): void {
    const navigateEvent = new CustomEvent('navigate', { detail: {href: href, external: isExternalLink}});
    document.body.dispatchEvent(navigateEvent);
  }

  protected abstract _render(): TemplateResult;
}
