import { LitElement, property, html, css } from 'lit-element';
import { PwaMenuItem } from './PwaMenuItem';

// Component imports for this element
import './pwa-menu-drawer-item';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

class PwaMenuDrawer extends LitElement {

  @property({type: Array})
  public menuItems: PwaMenuItem[];
  @property({type: String})
  public selectedItem: string;

  static styles = css`
    ${AppStyles}
    .menu-drawer {
      display: flex;
      flex-direction: column;
    }
  `;

  render() {
    let accordion = [];
    if (this.menuItems) {
      this.menuItems.forEach(mi => accordion.push(html`<pwa-menu-drawer-item class="menu-item" .menuItem="${mi}" .selectedItem=${this.selectedItem}></pwa-menu-drawer-item>`));
    }
    return accordion;
  }

  updated() {
    this.shadowRoot.querySelectorAll(".menu-item").forEach(mi => (<any>mi).checkState());
  }
}

window.customElements.define('pwa-menu-drawer', PwaMenuDrawer);
