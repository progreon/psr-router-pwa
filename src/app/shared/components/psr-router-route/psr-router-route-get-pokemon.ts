// Imports for this element
import { html } from 'lit-element';
import { PsrRouterRouteEntry } from './psr-router-route-entry';
import * as Route from 'SharedModules/psr-router-route';

// These are the elements needed by this element.
import '@vaadin/vaadin-combo-box/theme/material/vaadin-combo-box';

class PsrRouterRouteGetPokemon extends PsrRouterRouteEntry {
  _renderExpandingContent() {
    // TODO
    let getP = (<Route.RouteGetPokemon>super.routeEntry);
    let dom = [];
    if (getP && getP.choices.length >= 1) {
      if (getP.choices.length > 1) {
        dom.push(html`
          <div>
            Choose one:
            <vaadin-combo-box id="selected-pokemon" @selected-item-changed="${this._selectedChanged}"></vaadin-combo-box>
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
    return dom;
  }

  protected _hasExpandingContent(): boolean {
    return true;
  }

  _renderStyle() {
    // TODO
    return undefined;
  }

  constructor(routeEntry=undefined) {
    super(routeEntry);
    // TODO
  }

  protected _getSummary() {
    let summary = super._getSummary();
    if (!summary?.trim() && !super._getTitle()?.trim()) {
      summary = super.routeEntry ? (<Route.RouteGetPokemon>super.routeEntry).toString() : "";
    }
    return summary;
  }

  updated(_changedProperties) {
    super.updated(_changedProperties);
    let getP = (<Route.RouteGetPokemon>super.routeEntry);

    let comboBox: any = this.shadowRoot.getElementById("selected-pokemon");
    if (comboBox && !comboBox.items) {
      let indexedChoices = getP.choices.map((c, i) => { return { index: i, value: c.toString() }; });
      comboBox.items = indexedChoices;
      comboBox.itemLabelPath = "value";
      comboBox.value = comboBox.items[getP.currentChoice].value;
    }
  }

  _selectedChanged(e) {
    let comboBox: any = this.shadowRoot.getElementById("selected-pokemon");
    let getP = (<Route.RouteGetPokemon>super.routeEntry);
    if (!e.detail.value) {
      comboBox.value = comboBox.items[getP.currentChoice].value;
    } else if (e.detail.value.index != getP.currentChoice) {
      getP.currentChoice = e.detail.value.index;
    }
  }
}

window.customElements.define('psr-router-route-get-pokemon', PsrRouterRouteGetPokemon);
