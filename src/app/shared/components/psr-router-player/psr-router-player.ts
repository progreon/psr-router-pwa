// Imports for this element
import { html, css, LitElement, property, customElement, unsafeCSS } from 'lit-element';
import { Player } from 'SharedModules/psr-router-model/Model';

@customElement('psr-router-player')
class PsrRouterPlayer extends LitElement {

  @property({ type: Object })
  private player: Player

  static get styles() {
    return css`
      .content {
        display: flex;
        flex-flow: column nowrap;
      }
      .row {
        display: flex;
        flex-flow: column nowrap;
      }
      .col {
        display: flex;
        flex-flow: column nowrap;
      }
      h2, ul, ol {
        margin: 0px;
      }
      @media (min-width: ${unsafeCSS(window.MyAppGlobals.wideWidth)}) {
        .row {
          flex-flow: row nowrap;
        }
        .col {
          margin-left: 10px;
        }
        .col:first-child {
          margin-left: 0px;
        }
      }
    `;
  }

  render() {
    let partyDOM = [];
    this.player.team.forEach(b => {
      partyDOM.push(html`<li>${b.toString()}</li>`);
    });
    let itemsDOM = []; // TODO: table -> index, item, count (, selling price? or on hover?)
    // TODO: if i >= 20 => red text
    this.player.bag.forEach((is, i) => {
      itemsDOM.push(html`<li>${is.toString()}</li>`);
    });
    let badgesDOM = [];
    this.player.badges.forEach(b => {
      badgesDOM.push(html`<li>${b}</li>`);
    });
    return html`
      <div class="content">
        <h2>${this.player.name}</h2>
        <div class="row">
          <div class="col">
            <div>Money: ₽${this.player.money}</div>
            <div>Party</div>
            <ol>${partyDOM}</ol>
            <div>Badge boosts</div>
            <ul>${badgesDOM}</ul>
          </div>
          <div class="col">
            <div>Bag items</div>
            <ol>${itemsDOM}</ol>
          </div>
        </div>
      </div>
    `;
  }
}
