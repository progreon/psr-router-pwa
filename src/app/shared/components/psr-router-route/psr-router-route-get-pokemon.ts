// Imports for this element
import { html } from 'lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-mwc/psr-router-select';

class PsrRouterRouteGetPokemon extends PsrRouterRouteEntry {
  _renderExpandingContent() {
    let getP = (<Route.RouteGetPokemon>super.routeEntry);
    let dom = [];
    let choices = getP.choices;
    let choicesDOM = [];
    choices.forEach((e, i) => choicesDOM.push(html`<mwc-list-item .value="${i}">${e.toString()}</mwc-list-item>`));
    let selected = getP.currentChoice;
    if (getP && getP.choices.length >= 1) {
      if (getP.choices.length > 1) {
        dom.push(html`
          <div style="display: flex; align-items: center;">
            Choose one:&nbsp;
            <psr-router-select id="selected-pokemon" @action="${this._selectedChanged}" .value="${selected}" withDialogFix>
              ${choicesDOM}
            </psr-router-select>
          </div>
        `);
      } else {
        dom.push(html`
          <div>
            Get ${getP.choices[0]}
          </div>
        `);
      }
    }
    if (getP?.info?.description) {
      dom.push(html`<hr style="height: 1px; border: 0; background-color: rgba(0, 0, 0, .25); margin: 4px 0px 4px 0px;">`);
      dom.push(html`<div>${getP.info.description}</div>`);
    }
    return html`${dom}`;
  }

  protected _hasExpandingContent(): boolean {
    return true;
  }

  protected _getSummary() {
    let summary = super._getSummary();
    if (!summary?.trim() && !super._getTitle()?.trim()) {
      summary = super.routeEntry ? (<Route.RouteGetPokemon>super.routeEntry).toString() : "";
    }
    return summary;
  }

  _selectedChanged() {
    let select: any = this.shadowRoot.getElementById("selected-pokemon");
    (<Route.RouteGetPokemon>super.routeEntry).currentChoice = select.value;
  }
}

window.customElements.define('psr-router-route-get-pokemon', PsrRouterRouteGetPokemon);
