import { LitElement, property, html } from 'lit-element';
import { PwaMenuItem } from './PwaMenuItem';

// These are the shared styles needed by this element.
import { AppStyles } from 'Shared/app-styles';

// Image imports for this element
import { angleDownIcon, angleUpIcon } from 'Shared/my-icons';

class PwaMenuDrawerItem extends LitElement {

  @property({type: Object})
  public menuItem: PwaMenuItem;
  @property({type: String})
  public selectedItem: string;
  @property({type: Boolean})
  private _hideContent: Boolean

  render() {
    const menuItem = this.menuItem;
    const expandable = menuItem.subMenuItems && menuItem.subMenuItems.length > 0;
    const expandingDOM = [];
    if (expandable) {
      menuItem.subMenuItems.forEach(sm => expandingDOM.push(html`<pwa-menu-drawer-item .menuItem="${sm}" .selectedItem="${this.selectedItem}"></pwa-menu-drawer-item>`));
    }
    let icon = this._hideContent ? angleDownIcon : angleUpIcon;
    return html`
      ${AppStyles}
      <style>
        .header {
          display: flex;
          justify-content: space-between;
        }
        .header[pointer] {
          cursor: pointer;
        }
        .header[selected] {
          /* border-bottom: 1px solid var(--app-header-menu-active-color); */
          box-shadow: inset 0px -2px var(--app-header-menu-active-color);
        }
        .icon {
          padding-right: 5px;
          align-self: center;
        }
        .icon > svg {
          width: 12px;
          height: 12px;
          fill: var(--app-header-menu-text-color);
        }
        .icon.expand {
          padding: 0px 0px 0px 5px;
        }
        .icon.info {
          cursor: pointer;
        }
        .link {
          align-self: center;
          text-decoration: none;
          color: inherit;
          flex-grow: 1;
          padding: 4px 0px;
        }
        .content {
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        .content > * {
          width: 100%;
        }
        .content > #expand {
          display: ${expandable ? "flex" : "none"};
          padding-left: 10px;
          height: auto;
          flex-direction: column;
          overflow: hidden;
          -webkit-transition: height 0.3s ease-out;
          -moz-transition: height 0.3s ease-out;
          -o-transition: height 0.3s ease-out;
          transition: height 0.3s ease-out;
        }
        .content > #expand > * {
          width: 100%;
        }
      </style>
      <div class="header" ?pointer="${menuItem.clickable}" ?selected="${this.menuItem.key === this.selectedItem}" @click="${e => this._onClick(e, menuItem, true)}" >
        <vaadin-item class="link" @click="${e => this._onClick(e, menuItem, true)}">
          <div>${menuItem.title}</div>
        </vaadin-item>
        <div class="icon expand" @click="${e => this._onClick(e, menuItem, false)}" ?hidden="${!expandable}">${icon}</div>
      </div>
      <div class="content">
        <div id="expand">
          ${expandingDOM}
        </div>
      </div>
    `;
  }

  constructor(menuItem, selectedItem) {
    super();
    this.menuItem = menuItem;
    this.selectedItem = selectedItem;
    this._hideContent = !(selectedItem && menuItem.key === menuItem.containsPage(selectedItem));
  }

  firstUpdated() {
    this.checkState();
  }

  checkState() {
    this._hideContent = !(this.selectedItem && this.menuItem.containsPage(this.selectedItem));
    let content = this.shadowRoot.getElementById('expand');
    if (content && content.innerHTML)
      if (this._hideContent)
        this._collapseContent(content);
      else
        this._expandContent(content);
  }

  _collapseContent(content, animate = false) {
    if (animate) {
      let sectionHeight = content.scrollHeight;
      let elementTransition = content.style.transition;
      content.style.transition = '';
      requestAnimationFrame(function() {
        content.style.height = sectionHeight + 'px';
        content.style.transition = elementTransition;
        requestAnimationFrame(function() {
          content.style.height = 0 + 'px';
        });
      });
    } else {
      content.style.height = 0 + 'px';
    }
    this._hideContent = true;
  }

  _expandContent(content, animate = false) {
    if (animate) {
      let sectionHeight = content.scrollHeight;
      content.style.height = sectionHeight + 'px';
      content.addEventListener('transitionend', function handler(e) {
        content.removeEventListener('transitionend', handler);
        content.style.height = null;
      });
    } else {
      content.style.height = null;
    }
    this._hideContent = false;
  }

  _onClick(e, menuItem, gotoPage) {
    e.cancelBubble = true;
    if (menuItem.clickable && gotoPage) {
      document.body.dispatchEvent(new CustomEvent('navigate', { detail: {href: menuItem.key } }));
    } else {
      let content = this.shadowRoot.getElementById('expand');
      if (content.innerHTML)
        if (this._hideContent)
          this._expandContent(content, true);
        else
          this._collapseContent(content, true);
    }
  }
}

window.customElements.define('pwa-menu-drawer-item', PwaMenuDrawerItem);
