'use strict';

// Imports for this element
import { LitElement, html } from '@polymer/lit-element';
import * as Route from 'SharedModules/psr-router-route';

// Image imports for this element
import { angleDownIcon, angleUpIcon, infoCircle } from 'Shared/my-icons';

// These are the elements needed by this element.
import '@vaadin/vaadin-item/theme/material/vaadin-item';
import '@vaadin/vaadin-dialog/theme/material/vaadin-dialog';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// TODO: show messages.
export class PsrRouterRouteEntry extends LitElement {
  _renderPopupContent() {
    return undefined;
  }

  _renderExpandingContent() {
    return undefined;
  }

  render() {
    const expandingDOM = this._renderExpandingContent();
    const popupDOM = this._renderPopupContent();

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
        .entry {
          align-self: center;
          flex-grow: 1;
        }
        #expand {
          display: ${expandingDOM ? "flex" : "none"};
          height: auto;
          overflow: hidden;
          -webkit-transition: height 0.3s ease-out;
          -moz-transition: height 0.3s ease-out;
          -o-transition: height 0.3s ease-out;
          transition: height 0.3s ease-out;
        }
        .content {
          width: 100%;
          margin-left: 10px;
        }
      </style>
      <div class="buttons">
        <div class="icon info" @click="${this._openDialog}" ?hidden="${!popupDOM}">${infoCircle}</div>
      </div>
      <div class="header">
        <vaadin-item class="entry" @click="${this._onClick}">
          <div><strong>${this.routeEntry?this.routeEntry.info.title:""}</strong></div>
          <div>${this.routeEntry?this.routeEntry.info.summary:""}</div>
        </vaadin-item>
        <div class="icon expand" @click="${this._onClick}" ?hidden="${!expandingDOM}">${icon}</div>
      </div>
      <div id="expand">
        <div class="content">
          ${expandingDOM}
        </div>
      </div>
      <vaadin-dialog id="dialog">
        <template>
          ${popupDOM}
        </template>
      </vaadin-dialog>
    `;
  }

  static get properties() {
    return {
      /* The entry object. */
      routeEntry: Object,
      hideContent: Boolean
    }
  };

  constructor(routeEntry=undefined) {
    super();
    this.hideContent = true;
    this.routeEntry = routeEntry;
    this.addEventListener('data-updated', e => console.log('data updated!', e));
  }

  firstUpdated() {
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
}

window.customElements.define('psr-router-route-entry', PsrRouterRouteEntry);
