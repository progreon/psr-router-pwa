// JS imports
import { LitElement, html, property, TemplateResult, CSSResult } from 'lit-element';
import { PsrRouterApp } from 'App/psr-router-app';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

export abstract class PsrRouterPage extends LitElement {
  @property({type: Boolean, reflect: true})
  public active: boolean;
  @property({type: Object})
  public app: PsrRouterApp;

  get searchParams() {
    return this.app.searchParams;
  }

  static get styles(): CSSResult {
    return AppStyles;
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
    this.app.navigateTo(href, isExternalLink);
  }

  protected abstract _render(): TemplateResult;
}
