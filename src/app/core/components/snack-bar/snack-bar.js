import { LitElement, html } from 'lit-element';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class SnackBar extends LitElement {
  render() {
    return html`
      ${AppStyles}
      <style>
        :host {
          display: block;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 12px;
          color: white;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
          text-align: center;
          will-change: transform;
          transform: translate3d(0, 100%, 0);
          transition-property: visibility, transform;
          transition-duration: 0.2s;
          visibility: hidden;
          /* TODO: FIX THIS */
          background-color: ${this.offline?'var(--app-color-error-red)':'var(--app-color-success-green)'};
        }
        :host([active]) {
          visibility: visible;
          transform: translate3d(0, 0, 0);
        }
        @media (min-width: ${MyAppGlobals.wideWidth}) {
          :host {
            width: 320px;
            margin: auto;
          }
        }
      </style>
      <slot></slot>
    `;
  }

  static get properties() {
    return {
      active: {type: Boolean, reflect: true},
      offline: {type: Boolean, reflect: true}
    };
  }
}

window.customElements.define('snack-bar', SnackBar);
