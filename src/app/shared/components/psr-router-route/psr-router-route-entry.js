// Imports for this element
import { LitElement, html } from '@polymer/lit-element';

// Image imports for this element
import { angleDownIcon, angleUpIcon, circleIcon } from 'Shared/my-icons';

// These are the elements needed by this element.
// import '@vaadin/vaadin-item/vaadin-item';
import '@vaadin/vaadin-item/theme/material/vaadin-item';

// CSS imports for this element
import { AppStyles } from 'Shared/app-styles';

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class PsrRouterRouteEntry extends LitElement {
  _renderRouteEntryContent(props) {
    return undefined;
  }

  _renderRouteEntryStyle(props) {
    return undefined;
  }

  _render(props) {
    var children = props.routeEntry ? props.routeEntry.getChildren() : [];
    var childElements = [];
    for (var i = 0; i < children.length; i++) {
      if (i !== 0)
        childElements.push(html`<hr />`);

      switch (children[i].getEntryType()) {
        // case "ENTRY":
        //   blabla;
        //   break;
        case "ROUTE":
        case "SECTION":
        case "ENTRY":
        default:
          childElements.push(html`<psr-router-route-entry id="${'child-' + i}" routeEntry=${children[i]}></psr-router-route-entry>`);
      }
    }

    var icon;
    if (children.length > 0) {
      icon = props.hideChildren ? angleDownIcon : angleUpIcon;
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
      ${this._renderRouteEntryStyle(props)}
      <div class="header" on-click=${e => this._onClick(e)}>
        <vaadin-item class="entry">
          <div><strong>${props.routeEntry?props.routeEntry.title:""}</strong></div>
          <div>${props.routeEntry?props.routeEntry.description:""}</div>
        </vaadin-item>
        <div class="icon" hidden?="${icon == undefined}">${icon}</div>
      </div>
      <div class="content">
        ${this._renderRouteEntryContent(props)}
      </div>
      <div id="children">
        ${childElements}
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
