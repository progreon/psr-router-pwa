import { LitElement } from '@polymer/lit-element';

export class PsrRouterPage extends LitElement {
  static get properties() {
    return {
      active: Boolean,
      game: Object,
      searchParams: Object
    }
  }

  _navigateTo(href, isExternalLink) {
    const navigateEvent = new CustomEvent('navigate', { detail: {href: href, external: isExternalLink}});
    document.body.dispatchEvent(navigateEvent);
  }

  // Only render this page if it's actually visible.
  _shouldRender(props, changedProps, old) {
    return props.active;
  }
}
