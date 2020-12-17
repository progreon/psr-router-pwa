// Imports for this element
import { html, css, LitElement, property, customElement } from 'lit-element';
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
    `;
  }

  render() {
    let partyDOM = [];
    this.player.team.forEach(b => {
      partyDOM.push(html`<li>${b.toString()}</li>`);
    });
    let itemsDOM = []; // TODO: table -> index, item, count (, selling price? or on hover?)
    this.player.bag.forEach((is, i) => {
      itemsDOM.push(html`<li>${i + 1}: ${is.toString()}</li>`);
    });
    let badgesDOM = [];
    this.player.badges.forEach(b => {
      badgesDOM.push(html`<li>${b}</li>`);
    });
    // this.player.
    return html`
      <div class="content">
        <div>Party:</div>
        <ul ?hidden="${partyDOM.length == 0}">${partyDOM}</ul>
        <div>Bag items:</div>
        <ul ?hidden="${itemsDOM.length == 0}">${itemsDOM}</ul>
        <div>Badge boosts:</div>
        <ul ?hidden="${badgesDOM.length == 0}">${badgesDOM}</ul>
      </div>
    `;
  }
}
