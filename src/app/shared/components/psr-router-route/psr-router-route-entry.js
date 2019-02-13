'use strict';

// Imports for this element
import { LitElement, html } from '@polymer/lit-element';
import * as Route from 'SharedModules/psr-router-route';

// Image imports for this element
import { angleDownIcon, angleUpIcon, infoCircle } from 'Shared/my-icons';

// These are the elements needed by this element.
import '@vaadin/vaadin-item/theme/material/vaadin-item';
import '@vaadin/vaadin-dialog/theme/material/vaadin-dialog';
// import '@vaadin/vaadin-context-menu';
// import '@vaadin/vaadin-list-box';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// TODO: show messages.
export class PsrRouterRouteEntry extends LitElement {
  _getPopupContentRenderer() {
    return undefined;
  }

  _renderContent() {
    return undefined;
  }

  _renderExpandingContent() {
    if (this.routeEntry.info.description) {
      var dom = [];
      var description = this.routeEntry.info.description;
      var is = 0; // istart
      while (is < description.length) {
        var i1 = description.indexOf("[[", is);
        var i2 = i1 >= 0 ? description.indexOf("]]", i1) : -1;
        if (i2 < 0) {
          dom.push(html`${description.substring(is)}`);
          is = description.length;
        } else {
          dom.push(html`<div style="white-space: pre-wrap;">${description.substring(is, i1)}</div>`);
          var img = description.substring(i1 + 2, i2);
          dom.push(html`<img src="${img}" style="width: 100%;"></img>`);
          is = i2 + 2;
        }
      }
      return dom;
    } else {
      return undefined;
    }
  }

  _getTitle() {
    return this.routeEntry && this.routeEntry.info.title || "";
  }

  _getSummary() {
    return this.routeEntry && this.routeEntry.info.summary || "";
  }

  render() {
    const contentDOM = this._renderContent();
    const expandingDOM = this._renderExpandingContent();
    const popupAvailable = !!this._getPopupContentRenderer();

    let messages = [];
    if (this.routeEntry) {
      this.routeEntry.messages.forEach(m => {
        let level;
        switch (m.type.priority) {
          case 0:
            level = "error";
            break;
          case 1:
            level = "warn";
            break;
          case 2:
            level = "info";
            break;
        }
        if (level) {
          messages.push(html`<div .className="${level}">${m.message}</div>`);
        }
      });
    }

    var icon = this.hideContent ? angleDownIcon : angleUpIcon;

    return html`
      ${AppStyles}
      <style>
        .buttons {
          display: flex;
          align-items: center;
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
          padding-right: 5px;
          align-self: center;
        }
        .icon > svg {
          width: 12px;
          height: 12px;
        }
        .icon.expand {
          padding: 0px 0px 0px 5px;
        }
        .icon.info {
          cursor: pointer;
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
          display: ${expandingDOM ? "flex" : "none"};
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

        .menu-options {
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
        }
      </style>
      <div class="buttons">
        <div class="icon info" @click="${this._openDialog}" ?hidden="${!popupAvailable}">${infoCircle}</div>
      </div>
      <div class="messages">
        ${messages}
      </div>
      <div class="header" ?hidden="${this.routeHeader}" ?pointer="${!this.routeHeader && expandingDOM}">
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
        <vaadin-item class="entry" @click="${this._onClick}">
          <div><strong>${this._getTitle()}</strong></div>
          <div>${this._getSummary()}</div>
        </vaadin-item>
        <!-- </vaadin-context-menu> -->
        <div class="icon expand" @click="${this._onClick}" ?hidden="${!expandingDOM}">${icon}</div>
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
      <vaadin-dialog id="dialog"></vaadin-dialog>
    `;
  }

  static get properties() {
    return {
      hideContent: Boolean,
      /* The entry object. */
      routeEntry: Object
    }
  };

  constructor(routeEntry=undefined) {
    super();
    this.routeHeader = false;
    this.hideContent = true;
    this.routeEntry = routeEntry;
    this.addEventListener('data-updated', e => console.log('data updated!', e));
  }

  firstUpdated() {
    var dialog = this.shadowRoot.getElementById('dialog');
    dialog.renderer = this._getPopupContentRenderer();
    if (dialog.renderer) {
      dialog.renderer = dialog.renderer.bind(this);
    }
    var content = this.shadowRoot.getElementById('expand');
    if (content.innerHTML)
      if (this.hideContent)
        this._collapseContent(content);
  }

  _collapseContent(content, animate) {
    if (animate) {
      var sectionHeight = content.scrollHeight;
      var elementTransition = content.style.transition;
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
    this.hideContent = true;
  }

  _expandContent(content, animate) {
    if (animate) {
      var sectionHeight = content.scrollHeight;
      content.style.height = sectionHeight + 'px';
      content.addEventListener('transitionend', function handler(e) {
        content.removeEventListener('transitionend', handler);
        content.style.height = null;
      });
    } else {
      content.style.height = null;
    }
    this.hideContent = false;
  }

  _onClick(e) {
    e.cancelBubble = true;
    var content = this.shadowRoot.getElementById('expand');
    if (content.innerHTML)
      if (this.hideContent)
        this._expandContent(content, true);
      else
        this._collapseContent(content, true);
  }

  _openDialog() {
    var dialog = this.shadowRoot.getElementById("dialog");
    dialog.opened = true;
  }

  _fireEvent(eventName, detail) {
    const event = new CustomEvent(eventName, { detail });
    document.body.dispatchEvent(event);
  }
}

window.customElements.define('psr-router-route-entry', PsrRouterRouteEntry);
