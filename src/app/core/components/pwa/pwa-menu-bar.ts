import { LitElement, property, html, css } from 'lit-element';
import { PwaMenuItem } from './PwaMenuItem';

// Component imports for this element
import './pwa-menu-bar-item';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PwaMenuBar extends LitElement {

  @property({type: Array})
  public menuItems: PwaMenuItem[];
  @property({type: String})
  public selectedItem: String;

  static styles = css`
    ${AppStyles}
    .menu-bar {
      display: flex;
    }
  `;

  render() {
    let linkList = [];
    if (this.menuItems) {
      this.menuItems.forEach(mi => {
        const a = html`<pwa-menu-bar-item .menuItem="${mi}" .selectedItem="${this.selectedItem}"></pwa-menu-bar-item>`;
        linkList.push(a);
      });
    }
    return html`
      <div class="menu-bar">
        ${linkList}
      </div>
    `;
  }
}

window.customElements.define('pwa-menu-bar', PwaMenuBar);
