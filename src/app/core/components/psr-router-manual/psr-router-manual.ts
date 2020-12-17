// JS Imports
import { html } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

// These are the elements needed by this element.

class PsrRouterManual extends PsrRouterPage {
  _render() {
    return html`
      <style>
        ul {
          margin: var(--app-grid-x) 0px;
          padding-left: var(--app-grid-3x);
        }
        .code-lines {
          list-style-type: none;
          padding: 0px;
        }
        ul.sub {
          margin: 0px;
          padding-left: var(--app-grid-3x);
        }
      </style>
      <h2>Help</h2>
      <section>
        <h3>Table of Contents</h3>
        <ul>
          <li>Route file</li>
          <ul>
            <li>Description</li>
            <li>Section</li>
            <li>Battle</li>
            <li>Get Pokémon</li>
          </ul>
        </ul>
      </section>
      <section>
        <h3>Route file</h3>
        <p>Use tabs!</p>
        <p>If you want an example of any of this, just export an example route.</p>
        Specify the game this route uses:
        <ul class="code-lines">
          <li><code>Game: &lt;game&gt;</code></li>
        </ul>
        <ul>
          <li><code>&lt;game&gt;</code> Currently supported:</li>
          <ul>
            <li>r: Pokémon Red</li>
            <li>b: Pokémon Blue</li>
          </ul>
        </ul>
        Then the route:
        <ul class="code-lines">
          <li><code>Route: &lt;title&gt;</code></li>
          <ul class="code-lines sub">
            <li><code>&lt;entry&gt;</code></li>
            <li><code>[&lt;entry&gt;..]</code></li>
            <!-- <li><code>[..]]</code></li> -->
          </ul>
        </ul>
        <ul>
          <li><code>&lt;title&gt;</code> The title of the route</li>
          <li><code>&lt;entry&gt;</code> The possible entries are described below</li>
        </ul>

        <h4>Description</h4>
        <ul class="code-lines">
          <li><code>&lt;summary&gt;</code></li>
          <ul class="code-lines sub">
            <li><code>&lt;description&gt;</code></li>
          </ul>
        </ul>
        <ul>
          <li><code>&lt;summary&gt;</code> A brief description</li>
          <li><code>&lt;description&gt;</code> A more detailed description</li>
          <ul class="sub">
            <li>Will be shown in a popup</li>
            <li>Can be multiple lines</li>
            <li>use <code>[[&lt;image-url&gt;]]</code> if you want to include an image</li>
          </ul>
        </ul>

        <h4>Section</h4>
        <ul class="code-lines">
          <li><code>S: &lt;title&gt; [:: &lt;summary&gt;]</code></li>
          <ul class="code-lines sub">
            <li><code>&lt;entry&gt;</code></li>
            <li><code>[&lt;entry&gt;..]</code></li>
            <!-- <li><code>[..]]</code></li> -->
          </ul>
        </ul>
        <ul>
          <li><code>&lt;title&gt;</code> The section title</li>
          <li><code>&lt;summary&gt;</code> A brief description</li>
          <li><code>&lt;entry&gt;</code> Child entries (expanded dropdown)</li>
        </ul>

        <h4>Battle</h4>
        <ul class="code-lines">
          <li><code>B: &lt;trainer&gt; [:: &lt;shared&gt; [&lt;shared&gt;..]]</code></li>
          <ul class="code-lines sub">
            <li><code>[&lt;title&gt; ::] &lt;summary&gt;</code></li>
            <li><code>[&lt;description&gt;]</code></li>
          </ul>
        </ul>
        <ul>
          <li><code>&lt;trainer&gt;</code> The key/alias of the opponent</li>
          <ul class="sub">
            <li>All the keys and aliases can be found on the trainer page</li>
            <li>Trainer info will be visible in a popup</li>
          </ul>
          <li><code>&lt;shared&gt;</code> How experience must be shared</li>
          <ul class="sub">
            <li><code>&lt;tpId&gt;:&lt;ppId&gt;[,&lt;ppId&gt;..]</code></li>
            <ul class="sub">
              <li><code>&lt;tpId&gt;</code> The trainer party id</li>
              <li><code>&lt;ppId&gt;</code> The player party id</li>
            </ul>
            <li>Optional: by default the first pokemon in the player's party will be used</li>
          </ul>
          <li><code>&lt;title&gt;</code> A custom title (default is the trainer name)</li>
          <li><code>&lt;summary&gt;</code> A brief description</li>
          <li><code>&lt;description&gt;</code> A more detailed description (dropdown)</li>
        </ul>

        <h4>Get Pokémon</h4>
        <ul class="code-lines">
          <li><code>GetP: [#]&lt;option&gt; [[#]&lt;option&gt; [..]]</code></li>
          <ul class="code-lines sub">
            <li><code>[&lt;title&gt; ::] &lt;summary&gt;</code></li>
            <!-- <li><code>[&lt;description&gt;]</code></li> -->
          </ul>
        </ul>
        <ul>
          <li><code>&lt;option&gt;</code> An option to choose from</li>
          <ul class="sub">
            <li><code>&lt;pokemon&gt;:&lt;level&gt;</code></li>
            <li>With '#' you mark the option as preferred (only 1 allowed)</li>
          </ul>
          <li><code>&lt;title&gt;</code> An optional title</li>
          <li><code>&lt;summary&gt;</code> A brief description</li>
          <!-- <li><code>&lt;description&gt;</code> A more detailed description (dropdown)</li> -->
        </ul>
      </section>
    `;
  }
}

window.customElements.define('psr-router-manual', PsrRouterManual);
