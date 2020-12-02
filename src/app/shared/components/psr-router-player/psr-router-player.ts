// Imports for this element
import { html, css, LitElement, property, customElement } from 'lit-element';
import 'SharedComponents/psr-router-model/psr-router-battler';
import { Player } from 'SharedModules/psr-router-model/Model';

@customElement('psr-router-player')
class PsrRouterPlayer extends LitElement {

  @property({ type: Object })
  private player: Player

  static get styles() {
    return css`
      .content {
        display: flex;
      }
    `;
  }

  render() {
    return html`
      <div class="content">
        Hello ${this.player?.name}!
      </div>
    `;
  }
}
