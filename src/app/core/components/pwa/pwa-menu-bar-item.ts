import { LitElement, html, css, property } from 'lit-element';
import { PwaMenuItem } from './PwaMenuItem';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

// Image imports for this element
import { angleDownIcon } from 'Shared/my-icons';

class PwaMenuBarItem extends LitElement {

  @property({type: Object})
  public menuItem: PwaMenuItem;
  @property({type: String})
  public selectedItem: string;

  static styles = css`
    ${AppStyles}
    .dropdown {
      color: var(--app-header-menu-text-color);
      display: flex;
      cursor: pointer;
      align-items: center;
      line-height: 30px;
      padding: 8px 24px;
    }

    .dropdown:hover {
      color: var(--app-header-menu-selected-color);
      background-color: var(--app-header-menu-background-selected-color);
    }

    .dropdown[selected] {
      box-shadow: inset 0px 4px var(--app-header-menu-active-color);
    }

    .dropbtn {
      display: inline-block;
      text-decoration: none;
    }

    .icon {
      fill: var(--app-header-menu-text-color);
      padding-left: 6px;
      align-self: center;
    }

    .dropdown:hover > .icon {
      fill: var(--app-header-menu-selected-color);
    }

    .icon > svg {
      width: 12px;
      height: 12px;
      padding: 0px 0px 0px 5px;
    }

    .dropdown-content {
      display: none;
      background-color: var(--app-header-menu-background-selected-color);
      position: absolute;
      min-width: 160px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    }

    .dropdown-content > a {
      color: black;
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }

    .dropdown-content > a:hover {
      color: var(--app-header-menu-text-color);
      background-color: var(--app-header-menu-background-color);
    }

    .dropdown-content a[selected] {
      box-shadow: inset 4px 0px var(--app-header-menu-active-color);
    }

    .show {
      display: block;
    }
  `;

  render() {
    const menuItem = this.menuItem;
    const expandable = menuItem.subMenuItems && menuItem.subMenuItems.length > 0;

    let links = [];
    menuItem.subMenuItems.forEach(smi => {
      links.push(html`<a href="${smi.key}" ?selected=${smi.containsPage(this.selectedItem)}>${smi.title}</a>`);
    });

    return html`
      <div class="dropdown" ?selected="${menuItem.containsPage(this.selectedItem)}" @click=${this._handleButtonClick}>
        <div class="dropbtn">${menuItem.title}</div>
        <div class="icon" ?hidden="${!expandable}">${angleDownIcon}</div>
      </div>
      <div id="dropdown-area" class="dropdown-content">
        ${links}
      </div>
    `;
  }

  firstUpdated() {
    this.addEventListener('mouseenter', this.showDropdown);
    this.addEventListener('mouseleave', this.hideDropdown);
  }

  _handleButtonClick(e) {
    if (this.menuItem.clickable) {
      document.body.dispatchEvent(new CustomEvent('navigate', { detail: {href: this.menuItem.key } }));
    } else {
      this.showDropdown();
    }
  }

  showDropdown() {
    if (this.menuItem.subMenuItems && this.menuItem.subMenuItems.length > 0)
      this.shadowRoot.getElementById("dropdown-area").classList.add('show');
  }

  hideDropdown() {
    this.shadowRoot.getElementById("dropdown-area").classList.remove('show');
  }
}

window.customElements.define('pwa-menu-bar-item', PwaMenuBarItem);
