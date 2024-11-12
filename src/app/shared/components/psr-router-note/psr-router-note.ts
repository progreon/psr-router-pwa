// JS Imports
import { html, customElement, LitElement, property, TemplateResult, queryAll, css } from 'lit-element';

@customElement("psr-router-note")
export class PsrRouterNote extends LitElement {
  static styles = css`
    p {
      display: flex;
      align-items: center;
      padding: 1em;
      border-radius: .5em;
      background-color: rgba(0, 0, 255, .3)
    }
    p > img {
      margin-right: 1em;
    }
  `;

  protected render() {
    return html`
      <p><img src="https://material-icons.github.io/material-icons/svg/info/outline.svg" alt="note"><slot></slot></p>
    `;
  }
}