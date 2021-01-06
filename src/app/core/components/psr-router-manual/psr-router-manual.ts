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
          <li>Route entries</li>
          <ul class="sub">
            <li>Battle</li>
            <li>Description</li>
            <li>Encounter (temporary version)</li>
            <li>Get Pokémon</li>
            <li>Manip</li>
            <li>Menu</li>
            <li>Section</li>
          </ul>
          <li>Route actions</li>
          <ul class="sub">
            <li>Battler Settings</li>
            <li>Description</li>
            <li>Opponent actions</li>
            <li>Swap items</li>
            <li>Swap moves</li>
            <li>Swap Pokémon</li>
            <li>Use TM or HM</li>
            <li>Toss item (not implemented yet)</li>
            <li>Use item (not fully implemented yet)</li>
          </ul>
        </ul>
      </section>

      <section>
        <h3 id="route-file">Route file</h3>
        <p>Use tabs!</p>
        <p>If you want an example of any of this, just export an example route.</p>
        Specify the game this route uses:
        <ul class="code-lines">
          <li><code>Game: &lt;game&gt;</code></li>
        </ul>
        <ul>
          <li><code>&lt;game&gt;</code> Currently (partially) supported:</li>
          <ul>
            <li>r: Pokémon Red</li>
            <li>b: Pokémon Blue</li>
            <li>y: Pokémon Yellow</li>
          </ul>
        </ul>
        Then the route:
        <ul class="code-lines">
          <li><code>Route: &lt;title&gt;</code></li>
          <ul class="code-lines sub">
            <li><code>&lt;entry&gt;</code></li>
            <li><code>[&lt;entry&gt;</code></li>
            <li><code>&nbsp;..]</code></li>
          </ul>
        </ul>
        <ul>
          <li><code>&lt;title&gt;</code> The title of the route</li>
          <li><code>&lt;entry&gt;</code> The possible entries are described below</li>
        </ul>
      </section>
      <section>
        <h3>Route entries</h3>

        <h4>Battle</h4>
        <ul class="code-lines">
          <li><code>B: &lt;trainer&gt; [[:: &lt;title&gt;] :: &lt;summary&gt;]</code></li>
          <ul class="code-lines sub">
            <li><code>[&lt;action&gt;</code></li>
            <li><code>&nbsp;..]</code></li>
          </ul>
        </ul>
        <ul>
          <li><code>&lt;trainer&gt;</code> The key/alias of the opponent</li>
          <ul class="sub">
            <li>All the keys and aliases can be found on the trainer page</li>
            <li>Trainer info will be visible in a popup</li>
          </ul>
          <li><code>&lt;title&gt;</code> A custom title (default is the trainer name)</li>
          <li><code>&lt;summary&gt;</code> A brief description</li>
          <li><code>&lt;action&gt;</code> What route actions to use here, choose between:</li>
          <ul class="sub">
            <li>BSettings</li>
            <li>Direction</li>
            <li>Opponent</li>
            <li>Swap items</li>
            <li>Swap moves</li>
            <li>Swap Pokémon</li>
            <li>Use</li>
          </ul>
        </ul>

        <h4>Description</h4>
        <ul class="code-lines">
          <li><code>&lt;summary&gt;</code></li>
          <ul class="code-lines sub">
            <li><code>[&lt;description&gt;</code></li>
            <li><code>&nbsp;..]</code></li>
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

        <h4>Encounter (temporary version)</h4>
        <ul class="code-lines">
          <li><code>E: &lt;pokemon&gt;:&lt;level&gt; [[:: &lt;title&gt;] :: &lt;summary&gt;]</code></li>
          <ul class="code-lines sub">
            <li><code>[&lt;action&gt;</code></li>
            <li><code>&nbsp;..]</code></li>
          </ul>
        </ul>
        <ul>
          <li><code>&lt;pokemon&gt;:&lt;level&gt;</code> The Pokémon with level to defeat</li>
          <li><code>&lt;title&gt;</code> A custom title</li>
          <li><code>&lt;summary&gt;</code> A brief description</li>
          <li><code>&lt;action&gt;</code> What route actions to use here, choose between:</li>
          <ul class="sub">
            <li>BSettings</li>
            <li>Direction</li>
            <li>Swap items</li>
            <li>Swap moves</li>
            <li>Swap Pokémon</li>
            <li>Use</li>
          </ul>
        </ul>

        <h4>Get Pokémon</h4>
        <ul class="code-lines">
          <li><code>GetP: [#]&lt;option&gt; [[#]&lt;option&gt; [..]]</code></li>
          <ul class="code-lines sub">
            <li><code>[&lt;title&gt; ::] &lt;summary&gt;</code></li>
            <li><code>[&lt;description lines&gt;]</code></li>
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
          <li><code>&lt;description lines&gt;</code> A more detailed description</li>
        </ul>

        <h4>Manip (temporary version)</h4>
        <ul class="code-lines">
          <li><code>Manip: &lt;pokemon&gt;:&lt;level&gt; &lt;dvs&gt;</code></li>
          <ul class="code-lines sub">
            <li><code>[&lt;title&gt; ::] &lt;summary&gt;</code></li>
            <li><code>[&lt;description lines&gt;]</code></li>
          </ul>
        </ul>
        <ul>
          <li><code>&lt;pokemon&gt;:&lt;level&gt;</code> The Pokémon with level to defeat</li>
          <li><code>&lt;dvs&gt;</code> A space-separated list of dv's</li>
          <ul class="sub">
            <li><code>&lt;hp&gt; &lt;atk&gt; &lt;def&gt; &lt;spd&gt; &lt;spc&gt;</code></li>
            <li>Each dv can be a combination of dv's, comma separated (hp dv will be recalculated if needed)</li>
          </ul>
          <li><code>&lt;title&gt;</code> A custom title</li>
          <li><code>&lt;summary&gt;</code> A brief description</li>
          <li><code>&lt;description lines&gt;</code> A more detailed description</li>
        </ul>

        <h4>Menu</h4>
        <ul class="code-lines">
          <li><code>Menu: [&lt;title&gt; ::] &lt;summary&gt;</code></li>
          <ul class="code-lines sub">
            <li><code>[&lt;action&gt;</code></li>
            <li><code>&nbsp;..]</code></li>
          </ul>
        </ul>
        <ul>
          <li><code>&lt;title&gt;</code> A custom title</li>
          <li><code>&lt;summary&gt;</code> A brief description</li>
          <li><code>&lt;action&gt;</code> What route actions to use here, choose between:</li>
          <ul class="sub">
            <li>BSettings</li>
            <li>Direction</li>
            <li>Swap items</li>
            <li>Swap Pokémon</li>
            <li>Tm</li>
            <li>Toss</li>
            <li>Use</li>
          </ul>
        </ul>

        <h4>Section</h4>
        <ul class="code-lines">
          <li><code>S: &lt;title&gt; [:: &lt;summary&gt;]</code></li>
          <ul class="code-lines sub">
            <li><code>&lt;entry&gt;</code></li>
            <li><code>[&lt;entry&gt;</code></li>
            <li><code>&nbsp;..]</code></li>
          </ul>
        </ul>
        <ul>
          <li><code>&lt;title&gt;</code> The section title</li>
          <li><code>&lt;summary&gt;</code> A brief description</li>
          <li><code>&lt;entry&gt;</code> Child entries (expanded dropdown)</li>
        </ul>
      </section>
      <section>
        <h3>Route actions</h3>

        <h4>Battler Settings</h4>
        <ul class="code-lines">
          <li><code>BSettings: &lt;party index:1&gt; [:: &lt;description&gt;]</code></li>
          <ul class="code-lines sub">
            <li><code>&lt;key&gt;: &lt;value&gt;</code></li>
            <li><code>[&lt;key&gt;: &lt;value&gt;</code></li>
            <li><code>&nbsp;..]</code></li>
          </ul>
        </ul>
        <ul>
          <li><code>&lt;key&gt;: &lt;value&gt;</code> Settings are set in key-value pairs, currently supported:</li>
          <ul class="sub">
            <li>TEACH: &lt;level up move&gt; &lt;moveset move&gt;</li>
          </ul>
        </ul>

        <h4>Description</h4>
        <ul class="code-lines">
          <li><code>&lt;description&gt;</code></li>
        </ul>

        <h4>Opponent actions</h4>
        <ul class="code-lines">
          <li><code>Opp: &lt;opponent index&gt; [:: [*]&lt;party index:1&gt;..]</code></li>
          <ul class="code-lines sub">
            <li><code>&lt;action&gt;</code></li>
            <li><code>[&lt;action&gt;</code></li>
            <li><code>&nbsp;..]</code></li>
          </ul>
        </ul>
        <ul>
          <li><code>&lt;opponent index&gt;</code> The trainer pokemon index</li>
          <li><code>&lt;party index:1&gt;</code> The player pokemon index for this opponent (leading Pokémon by default)</li>
          <ul class="sub">
            <li>With '*' indicating that it dies here and doesn't get experience</li>
          </ul>
          <li><code>&lt;action&gt;</code> What route actions to use for this opponent, like using X-items</li>
        </ul>

        <h4>Swap items</h4>
        <ul class="code-lines">
          <li><code>Swap: &lt;index|item&gt; &lt;index|item&gt; [:: &lt;description&gt;]</code></li>
        </ul>
        <ul>
          <li><code>&lt;index|item&gt;</code> Item or bag item index to swap</li>
        </ul>

        <h4>Swap moves</h4>
        <ul class="code-lines">
          <li><code>SwapM: &lt;index|move&gt; &lt;index|move&gt; [:: &lt;description&gt;]</code></li>
        </ul>
        <ul>
          <li><code>&lt;index|move&gt;</code> Move or move index to swap</li>
        </ul>

        <h4>Swap Pokémon</h4>
        <ul class="code-lines">
          <li><code>SwapP: &lt;index&gt; [&lt;index&gt;] [:: &lt;description&gt;]</code></li>
        </ul>
        <ul>
          <li><code>&lt;index&gt;</code> Pokémon party index to swap</li>
          <ul class="sub">
            <li>Will swap to front if no second index given</li>
          </ul>
        </ul>

        <h4>Use TM or HM</h4>
        <ul class="code-lines">
          <li><code>TM: &lt;tm|hm&gt; [&lt;party index:1&gt; [&lt;move index&gt;]] [:: &lt;description&gt;]</code></li>
        </ul>
        <ul>
          <li><code>&lt;tm|hm&gt;</code> TM or HM to use</li>
          <li><code>&lt;party index:1&gt;</code> The pokemon party index to use this on (leading Pokémon by default)</li>
          <li><code>&lt;move index&gt;</code> The index of the Pokémon's move to replace</li>
          <ul class="sub">
            <li>If not given, it will try to add the move to the moveset if possible</li>
          </ul>
        </ul>

        <h4>Toss item (not implemented yet)</h4>
        <ul class="code-lines">
          <li><code>Toss: &lt;item&gt; [&lt;count:1&gt;]</code></li>
        </ul>
        <ul>
          <li><code>&lt;item&gt;</code> The item to toss</li>
          <li><code>&lt;count:1&gt;</code> How much to toss of it, can be:</li>
          <ul class="sub">
            <li>A number: will try to toss that many</li>
            <li>*: will toss every remaining of that item</li>
            <li>?: won't toss anything, but can be used as an indicator for the runner</li>
          </ul>
        </ul>

        <h4>Use item (not fully implemented yet)</h4>
        <ul class="code-lines">
          <li><code>Use: &lt;item&gt; [&lt;count:1&gt; [&lt;party index:1&gt; [&lt;move index:1&gt;]]]</code></li>
        </ul>
        <ul>
          <li><code>&lt;item&gt;</code> The item to toss</li>
          <li><code>&lt;count:1&gt;</code> How much to toss of it, can be:</li>
          <ul class="sub">
            <li>A number: will try to toss that many</li>
            <li>*: will toss every remaining of that item</li>
            <li>?: won't toss anything, but can be used as an indicator for the runner</li>
          </ul>
          <li><code>&lt;party index:1&gt;</code> The pokemon party index to use this on (leading Pokémon by default)</li>
          <li><code>&lt;move index:1&gt;</code> The index of the Pokémon's move to use this on (first move by default)</li>
        </ul>

      </section>
    `;
  }
}

window.customElements.define('psr-router-manual', PsrRouterManual);
