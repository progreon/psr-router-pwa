'use strict';

// Imports for this element
import { LitElement, html, property, css } from 'lit-element';
import * as Route from 'SharedModules/psr-router-route';

// Image imports for this element
import { angleDownIcon, angleUpIcon, infoCircle } from 'Shared/my-icons';

// These are the elements needed by this element.
import '@vaadin/vaadin-dialog/theme/material/vaadin-dialog';
// import '@vaadin/vaadin-context-menu';
// import '@vaadin/vaadin-list-box';

// CSS imports for this element
// import { AppStyles } from 'Shared/app-styles';
import { RouterMessage } from 'App/shared/modules/psr-router-util';

export class PsrRouterRouteEntry extends LitElement {

  @property({type: Route.RouteEntry})
  public routeEntry: Route.RouteEntry;
  @property({type: Boolean, reflect: true})
  public hideContent: boolean = true;
  protected routeHeader: boolean;
  private _isPendingExpandAnimation: boolean = false;
  private _boundChangeObserver: (entry: Route.RouteEntry, type: Route.RouteEntry.ObservableType) => (void);

  protected _getPopupContentRenderer(): (root: HTMLElement, dialog: HTMLElement) => void {
    return undefined;
  }

  protected _renderContent(): any {
    return undefined;
  }

  protected _renderExpandingContent(): any {
    if (this.routeEntry.info.description) {
      let dom = [];
      let description = this.routeEntry.info.description;
      let is = 0; // istart
      while (is < description.length) {
        let i1 = description.indexOf("[[", is);
        let i2 = i1 >= 0 ? description.indexOf("]]", i1) : -1;
        if (i2 < 0) {
          dom.push(html`<div style="white-space: pre-wrap;">${description.substring(is)}</div>`);
          is = description.length;
        } else {
          dom.push(html`<div style="white-space: pre-wrap;">${description.substring(is, i1)}</div>`);
          let img = description.substring(i1 + 2, i2);
          dom.push(html`<img src="${img}" style="width: 100%;">`);
          is = i2 + 2;
        }
      }
      return dom;
    } else {
      return undefined;
    }
  }

  protected _hasExpandingContent(): boolean {
    return !!this.routeEntry.info.description;
  }

  protected _getTitle(): string {
    return this.routeEntry && this.routeEntry.info.title || "";
  }

  protected _getSummary(): string {
    return this.routeEntry && this.routeEntry.info.summary || "";
  }

  static get styles() {
    return css`
      * {
        box-sizing: border-box;
      }
      .header {
        display: flex;
        justify-content: space-between;
        border-radius: 5px;
      }
      .header[pointer] {
        cursor: pointer;
      }
      /* .header:hover {
        background-color: #bbbbbb;
        box-shadow: 5px 0px #bbbbbb, -5px 0px #bbbbbb;
      } */
      .header[hidden] {
        display: none;
      }
      /* .route-header > * {
        font-weight: bold;
      } */
      .route-header[hidden] {
        display: none;
      }
      .icon {
        padding-left: 5px;
        align-self: center;
      }
      .icon > svg {
        width: 12px;
        height: 12px;
      }
      .icon.info {
        cursor: pointer;
      }
      .icon.hidden {
        visibility: hidden;
      }
      .messages > .info {
        color: var(--app-color-ocean);
      }
      .messages > .warn {
        color: var(--app-color-warning-yellow);
      }
      .messages > .error {
        color: var(--app-color-error-red);
      }
      vaadin-context-menu {
        align-self: center;
        flex-grow: 1;
      }
      .entry {
        align-self: center;
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
        padding-left: 10px;
        height: auto;
        flex-direction: column;
        /* overflow: hidden; */
        -webkit-transition: height 0.3s ease-out;
        -moz-transition: height 0.3s ease-out;
        -o-transition: height 0.3s ease-out;
        transition: height 0.3s ease-out;
      }
      .content > #expand > * {
        width: 100%;
      }

      /* .menu-options {
        list-style: none;
        margin: 0px;
        padding: 0px;
      }

      .menu-options > .menu-option {
        font-weight: 500;
        font-size: 14px;
        padding: 10px 10px;
        cursor: pointer;
      }

      .menu-options > .menu-option:hover {
        background: rgba(0, 0, 0, 0.2);
      } */
    `;
  }

  render() {
    const contentDOM = this._renderContent();
    const hasExpandingDOM = this._hasExpandingContent();
    const expandingDOM = hasExpandingDOM && !this.hideContent ? this._renderExpandingContent() : undefined;
    const popupAvailable = !!this._getPopupContentRenderer();

    let messages = [];
    if (this.routeEntry) {
      this.routeEntry.messages.forEach(m => {
        let level: string;
        switch (m.type) {
          case RouterMessage.Type.Error:
            level = "error";
            break;
          case RouterMessage.Type.Warning:
            level = "warn";
            break;
          case RouterMessage.Type.Info:
            level = "info";
            break;
        }
        if (level) {
          messages.push(html`<div .className="${level}">${m.message}</div>`);
        }
      });
    }

    let icon = this.hideContent ? angleDownIcon : angleUpIcon;

    return html`
      <div class="messages">
        ${messages}
      </div>
      <div class="header" ?hidden="${this.routeHeader}" ?pointer="${!this.routeHeader && hasExpandingDOM}">
        <!-- <vaadin-context-menu>
          <template>
            <ul class="menu-options">
              <li class="menu-option">Edit... [TODO]</li>
              <li class="menu-option">Copy [TODO]</li>
              <li class="menu-option">Paste... [TODO]</li>
              <li class="menu-option">New... [TODO]</li>
              <li class="menu-option">Delete [TODO]</li>
            </ul>
          </template> -->
        <div class="entry" @click="${this._onClick}">
          <div><strong>${this._getTitle()}</strong></div>
          <div>${this._getSummary()}</div>
        </div>
        <!-- </vaadin-context-menu> -->
        <div class="icon info" @click="${this._openDialog}" ?hidden="${!popupAvailable}">${infoCircle}</div>
        <div class="icon expand" @click="${this._onClick}" ?hidden="${!hasExpandingDOM}">${icon}</div>
        <div class="icon hidden" ?hidden="${hasExpandingDOM}">${icon}</div>
      </div>
      <div class="route-header" ?hidden="${!this.routeHeader}">
        <h4><strong>${this.routeEntry?this.routeEntry.info.title:"No route loaded"}</strong></h4>
      </div>
      <div class="content">
        ${contentDOM}
        <div id="expand">
          ${expandingDOM}
        </div>
      </div>
    `;
  }

  constructor(routeEntry?: Route.RouteEntry) {
    super();
    this.routeHeader = false;
    this.hideContent = true;
    this.routeEntry = routeEntry;
    this._boundChangeObserver = this._changeObserver.bind(this);
  }

  firstUpdated() {
    let content = this.shadowRoot.getElementById('expand');
    if (this._hasExpandingContent() && this.hideContent) {
      this._collapseContent(content);
    }
  }

  updated(_changedProperties) {
    super.updated(_changedProperties);
    if (this._isPendingExpandAnimation && this._hasExpandingContent()) {
      let content = this.shadowRoot.getElementById('expand');
      if (this.hideContent) {
        this._collapseContent(content, false); // animation is currently broken
      } else {
        this._expandContent(content, false); // animation is currently broken
      }
      this._isPendingExpandAnimation = false;
    }
    if (this.routeEntry && !this.routeEntry.hasObserver(this._boundChangeObserver)) {
      this.routeEntry.addObserver(this._boundChangeObserver);
    }
  }

  protected _changeObserver(entry: Route.RouteEntry, type: Route.RouteEntry.ObservableType) {
    this.requestUpdate();
  }

  private _collapseContent(content: any, animate?: any): void {
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
    // this.hideContent = true;
  }

  private _expandContent(content: HTMLElement, animate?: boolean): void {
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
    // this.hideContent = false;
  }

  private _onClick(e: Event) {
    // Testing things out for performance...
    e.cancelBubble = true;
    // let content = this.shadowRoot.getElementById('expand');
    if (this._hasExpandingContent()) {
      // if (this.hideContent) {
      //   this._expandContent(content, true);
      // } else {
      //   this._collapseContent(content, true);
      // }
      this._isPendingExpandAnimation = true;
      this.hideContent = !this.hideContent;
      this.requestUpdate();
    }
  }

  private _openDialog() {
    // add a dialog to the html (it is checked, but it shouldn't exist), and remove it when it closes
    // this is waaay more performant than if we add it to the html beforehand, because of some warnings it's throwing
    let dialog: any = this.shadowRoot.getElementById("dialog");
    if (!dialog) {
      dialog = document.createElement('vaadin-dialog');
      dialog.id = "dialog";
      dialog.renderer = this._getPopupContentRenderer().bind(this);
      this.shadowRoot.appendChild(dialog);
      dialog.addEventListener('opened-changed', this._dialogClosed.bind(this))
    }
    dialog.opened = true;
  }

  private _dialogClosed(e: any) {
    if (!e.detail.value) {
      let dialog: any = this.shadowRoot.getElementById("dialog");
      this.shadowRoot.removeChild(dialog);
    }
  }

  protected _fireEvent(eventName: string, detail: any): void {
    const event = new CustomEvent(eventName, { detail });
    document.body.dispatchEvent(event);
  }
}

window.customElements.define('psr-router-route-entry', PsrRouterRouteEntry);
