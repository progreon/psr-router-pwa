// Imports for this element
import { html, TemplateResult } from 'lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

export class PsrRouterRouteDirections extends PsrRouterRouteEntry {
  protected _getPopupContent(): TemplateResult {
    if (this.routeEntry.info.description) {
      let dom = [];
      let description = this.routeEntry.info.description;
      let is = 0; // istart
      while (is < description.length) {
        let i1 = description.indexOf("[[", is);
        let i2 = i1 >= 0 ? description.indexOf("]]", i1) : -1;
        if (i2 < 0) {
          dom.push(html`<div style="white-space: pre-wrap;">${description.substring(is).trim()}</div>`);
          is = description.length;
        } else {
          dom.push(html`<div style="white-space: pre-wrap;">${description.substring(is, i1).trim()}</div>`);

          let [embedType, ...embedSrcArray] = description.substring(i1 + 2, i2).trim().split('||');
          if (embedSrcArray.length == 0) {
            embedSrcArray.push(embedType);
            embedType = "img";
          }
          let embedSrc = embedSrcArray.join('||');
          if (embedType.trim().toLocaleLowerCase() === "img" || embedType.trim().toLocaleLowerCase() === "image") {
            dom.push(html`<img .src="${embedSrc.trim()}" style="width:100%;" />`);
          } else if (embedType.trim().toLocaleLowerCase() === "yt" || embedType.trim().toLocaleLowerCase() === "youtube") {
            dom.push(html`<iframe .src="${embedSrc.trim()}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`);
          } else {
            // TODO: unsupported, default to image?
          }

          is = i2 + 2;
        }
      }
      return html`${dom}`;
    }
    return undefined;
  }

  _renderExpandingContent() {
    return undefined;
  }

  protected _hasExpandingContent(): boolean {
    return false;
  }

  constructor(routeDirections?: Route.RouteDirections) {
    super(routeDirections);
  }
}

window.customElements.define('psr-router-route-directions', PsrRouterRouteDirections);
