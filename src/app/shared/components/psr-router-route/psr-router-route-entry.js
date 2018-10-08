'use strict';

// Imports for this element
import { LitElement, html } from '@polymer/lit-element';
import * as Route from 'SharedModules/psr-router-route';

// Image imports for this element
import { angleDownIcon, angleUpIcon, circleIcon } from 'Shared/my-icons';

// These are the elements needed by this element.
// import '@vaadin/vaadin-item/vaadin-item';
import '@vaadin/vaadin-item/theme/material/vaadin-item';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// TODO: show messages.
export class PsrRouterRouteEntry extends LitElement {
  _renderRouteEntryChildren(props) {
    return undefined;
  }

  _renderRouteEntryContent(props) {
    return undefined;
  }

  _renderRouteEntryStyle(props) {
    return undefined;
  }

  render() {
    var icon;
    if (this.routeEntry && this.routeEntry._children.length > 0) {
      icon = this.hideChildren ? angleDownIcon : angleUpIcon;
    }

    return html`
      ${AppStyles}
      <style>
        .header {
          display: flex;
          justify-content: space-between;
        }
        .icon {
          padding: 0px 10px 0px 0px;
          align-self: center;
        }
        .icon > svg {
          width: 12px;
          height: 12px;
        }
        .entry {
          align-self: center;
        }
        .content {
          padding-left: 20px;
        }
        #children {
          padding-left: 20px;
          height: auto;
          overflow: hidden;
          -webkit-transition: height 0.3s ease-out;
          -moz-transition: height 0.3s ease-out;
          -o-transition: height 0.3s ease-out;
          transition: height 0.3s ease-out;
        }
      </style>
      ${this._renderRouteEntryStyle()}
      <div class="header" @click=${this._onClick}>
        <vaadin-item class="entry">
          <div><strong>${this.routeEntry?this.routeEntry.title:""}</strong></div>
          <div>${this.routeEntry?this.routeEntry.description:""}</div>
        </vaadin-item>
        <div class="icon" ?hidden="${icon == undefined}">${icon}</div>
      </div>
      <div class="content">
        ${this._renderRouteEntryContent()}
      </div>
      <div id="children">
        ${this._renderRouteEntryChildren()}
      </div>
    `;
  }

  static get properties() {
    return {
      /* The entry object. */
      routeEntry: Object,
      hideChildren: Boolean
    }
  };

  constructor(routeEntry=undefined) {
    super();
    this.hideChildren = false;
    this.routeEntry = routeEntry;
    this.addEventListener('data-updated', e => console.log('data updated!', e));
  }

  _collapseChildren(children) {
    var sectionHeight = children.scrollHeight;
    var elementTransition = children.style.transition;
    children.style.transition = '';
    requestAnimationFrame(function() {
      children.style.height = sectionHeight + 'px';
      children.style.transition = elementTransition;
      requestAnimationFrame(function() {
        children.style.height = 0 + 'px';
      });
    });
  }

  _expandChildren(children) {
    var sectionHeight = children.scrollHeight;
    children.style.height = sectionHeight + 'px';
    children.addEventListener('transitionend', function handler(e) {
      children.removeEventListener('transitionend', handler);
      children.style.height = null;
    });
  }

  _onClick(e) {
    e.cancelBubble = true;
    var children = this.shadowRoot.getElementById('children');
    if (this.hideChildren) {
      this._expandChildren(children);
    } else {
      this._collapseChildren(children);
    }
    this.hideChildren = !this.hideChildren;
  }
}

window.customElements.define('psr-router-route-entry', PsrRouterRouteEntry);
