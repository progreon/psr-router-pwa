// JS Imports
import { customElement, html, css } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

import { RouteManual, RouteManualData, RouteManualEntry } from './RouteManual';

// These are the elements needed by this element.
import 'SharedComponents/psr-router-note/psr-router-note';
import './psr-router-manual-table';
import { RouteBattle } from 'App/shared/modules/psr-router-route';

@customElement("psr-router-manual")
export class PsrRouterManual extends PsrRouterPage {

  // TODO: move the manual's contents to their respective classes
  private routeManual: RouteManual = RouteManual.from([
    {
      key: "game",
      title: "Game",
      type: "Route",
      description: "Specify the game this route uses",
      rf1Code: "Game: <game>",
      params: [
        new RouteManualData({
          name: "game", description: "The title of the route", options: [
            { value: "r", comment: "Pokémon Red" },
            { value: "b", comment: "Pokémon Blue [TODO]" },
            { value: "y", comment: "Pokémon Yellow [TODO]" }
          ]
        })
      ]
    },
    {
      key: "route",
      title: "Route",
      type: "Route",
      rf1Code: [
        "Route: <title>",
        "\t<entry>",
        "\t[<entry>",
        "\t ..]"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "title", description: "The title of the route" }),
        new RouteManualData({ name: "entry", description: "A route entry", type: "RouteEntry" })
      ]
    },
    {
      key: "battle",
      title: "Battle",
      type: "RouteEntry",
      rf1Code: [
        "B: <trainer> [[:: <title>] :: <summary>]",
        "\t[<action>",
        "\t..]"
      ].join('\n'),
      params: [
        new RouteManualData({
          name: "trainer", description: "The key/alias of the opponent.\nTrainer info will be visible in a popup.", options: [
            { value: "", comment: "All the keys and aliases can be found on the trainer page." },
          ]
        }),
        new RouteManualData({ name: "title", description: "A custom title", optional: true, default: "The trainer's name" }),
        new RouteManualData({ name: "summary", description: "A brief description", optional: true }),
        new RouteManualData({ name: "action", description: "What route actions to use here", type: "RouteAction", optional: true, options: ["BSettings", "Direction", "Opponent", "Swap Items", "Swap Move", "Swap Pokémon", "Use"].map(k => ({ value: k })) })
      ]
    },
    {
      key: "description",
      title: "Description",
      type: "RouteEntry",
      note: "Any entry-line you write without any prefix, or with an unknown prefix, will just be a description",
      rf1Code: [
        "<summary>",
        "\t[<description>",
        "\t..]"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "summary", description: "A brief description" }),
        new RouteManualData({ name: "description", description: "A more detailed description.\nWill be shown in a popup and can be multiple lines.\nUse [[<image-url>]] if you want to include an image", optional: true }),
        new RouteManualData({ name: "image-url", description: "URL to an image" })
      ]
    },
    {
      key: "encounter",
      title: "Encounter (temporary version)",
      type: "RouteEntry",
      rf1Code: [
        "E: <pokemon>:<level> [[:: <title>] :: <summary>]",
        "\t[<action>",
        "\t..]"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "pokemon", description: "The Pokémon to defeat" }),
        new RouteManualData({ name: "level", description: "The level of that Pokémon", type: "number" }),
        new RouteManualData({ name: "title", description: "A custom title", optional: true }),
        new RouteManualData({ name: "summary", description: "A brief description", optional: true }),
        new RouteManualData({ name: "action", description: "What route actions to use here", type: "RouteAction", optional: true, options: ["BSettings", "Direction", "Opponent", "Swap Items", "Swap Move", "Swap Pokémon", "Use"].map(k => ({ value: k })) })
      ]
    },
    {
      key: "geti",
      title: "Get Item",
      type: "RouteEntry",
      rf1Code: [
        "GetI: <item>[:<count>] [<traded for>] [[:: <title>] :: <summary>]",
        "\t[<description lines>]"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "item", description: "The item to get" }),
        new RouteManualData({ name: "count", description: "How many of them", type: "number", optional: true, default: "1" }),
        new RouteManualData({ name: "traded for", description: "What to trade it for", optional: true }),
        new RouteManualData({ name: "title", description: "An optional title", optional: true }),
        new RouteManualData({ name: "summary", description: "A brief description", optional: true }),
        new RouteManualData({ name: "description lines", description: "A more detailed description", optional: true })
      ]
    },
    {
      key: "getp",
      title: "Get Pokémon",
      type: "RouteEntry",
      rf1Code: [
        "GetP: [#]<option> [[#]<option> [..]]",
        "\t[<title> ::] <summary>",
        "\t[<description lines>]"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "option", description: "An option to choose from.\n'#' marks the preferred option (only 1 allowed).", type: "<pokemon>:<level>" }),
        new RouteManualData({ name: "title", description: "An optional title", optional: true }),
        new RouteManualData({ name: "summary", description: "A brief description", optional: true }),
        new RouteManualData({ name: "description lines", description: "A more detailed description", optional: true })
      ]
    },
    {
      key: "manip",
      title: "Manip (temporary version)",
      type: "RouteEntry",
      rf1Code: [
        "Manip: <pokemon>:<level> <dvs>",
        "\t[<title> ::] <summary>",
        "\t[<description lines>]"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "pokemon", description: "The Pokémon to defeat" }),
        new RouteManualData({ name: "level", description: "The level of that Pokémon", type: "number" }),
        new RouteManualData({ name: "dvs", description: "A space-separated list of dv's.\nEach dv can be a combination of dv's, comma separated (hp dv will be recalculated if needed)", type: "<hp> <atk> <def> <spd> <spc>" }),
        new RouteManualData({ name: "title", description: "A custom title", optional: true }),
        new RouteManualData({ name: "summary", description: "A brief description" }),
        new RouteManualData({ name: "description lines", description: "A more detailed description", optional: true })
      ]
    },
    {
      key: "menu",
      title: "Menu",
      type: "RouteEntry",
      rf1Code: [
        "Menu: [<title> ::] <summary>",
        "\t[<action>",
        "\t..]"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "title", description: "A custom title", optional: true }),
        new RouteManualData({ name: "summary", description: "A brief description" }),
        new RouteManualData({ name: "action", description: "What route actions to use here", type: "RouteAction", optional: true, options: ["BSettings", "Direction", "Swap Items", "Swap Pokémon", "Tm", "Toss", "Use"].map(k => ({ value: k })) })
      ]
    },
    {
      key: "section",
      title: "Section",
      type: "RouteEntry",
      rf1Code: [
        "S: <title> [:: <summary>]",
        "\t[<entry>",
        "\t..]"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "title", description: "A custom title" }),
        new RouteManualData({ name: "summary", description: "A brief description", optional: true }),
        new RouteManualData({ name: "entry", description: "Child entries (expanded dropdown)", optional: true, options: [{ value: '', comment: "Anything in this list" }] })
      ]
    },
    {
      key: "shop",
      title: "Shop",
      type: "RouteEntry",
      rf1Code: [
        "Shop: [<title> ::] <summary>",
        "\t[<shop entry>",
        "\t..]"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "title", description: "An optional title", optional: true }),
        new RouteManualData({ name: "summary", description: "A brief description", optional: true }),
        new RouteManualData({ name: "shop entry", description: "What to buy or sell", type: "<n> <item to buy n of> [:: <description>]\n-<n> <item to sell n of> [:: <description>]\n* <item to sell all of> [:: <description>]" }),
      ]
    },
    {
      key: "bsettings",
      title: "Battler Settings",
      type: "RouteAction",
      rf1Code: [
        "BSettings: <party index> [:: <description>]",
        "\t<setting>",
        "\t[<setting>",
        "\t..]"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "party index", description: "The position of the party Pokémon you want to apply the settings to", type: "number", default: "1" }),
        new RouteManualData({
          name: "setting", description: "Settings are set in '<key>: <value>' pairs", options: [
            { value: "TEACH: <level up move> <moveset move>" }
          ]
        }),
        new RouteManualData({ name: "description", description: "A brief description", optional: true })
      ]
    },
    {
      key: "description-action",
      title: "Description",
      type: "RouteAction",
      rf1Code: [
        "<description>"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "description", description: "A brief description" })
      ]
    },
    {
      key: "opponent-actions",
      title: "Opponent actions",
      type: "RouteAction",
      rf1Code: [
        "Opp: <opponent index> [:: [*]<party index>..]",
        "\t<action>",
        "\t[<action>",
        "\t..]"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "opponent index", description: "The trainer pokemon index", type: "number" }),
        new RouteManualData({ name: "party index", description: "The player pokemon index for this opponent.\nAdd '*' to indicate that it doesn't get experience ().", type: "number", optional: true, default: "1" }),
        new RouteManualData({ name: "action", description: "What route actions to use here", type: "RouteAction", optional: true, options: ["BSettings", "Direction", "Opponent", "Swap Items", "Swap Move", "Swap Pokémon", "Use"].map(k => ({ value: k })) })
      ]
    },
    {
      key: "swap-items",
      title: "Swap items",
      type: "RouteAction",
      rf1Code: [
        "Swap: <index|item> <index|item> [:: <description>]"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "index|item", description: "Bag item index or item to swap", type: "number or string" }),
        new RouteManualData({ name: "description", description: "A brief description", optional: true })
      ]
    },
    {
      key: "swap-moves",
      title: "Swap moves",
      type: "RouteAction",
      rf1Code: [
        "Swap: <index|move> <index|move> [:: <description>]"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "index|move", description: "Move index or move to swap", type: "number or string" }),
        new RouteManualData({ name: "description", description: "A brief description", optional: true })
      ]
    },
    {
      key: "swap-pokemon",
      title: "Swap Pokémon",
      type: "RouteAction",
      rf1Code: [
        "SwapP: <index1> [<index2>] [:: <description>]"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "index1", description: "Pokémon party index to swap", type: "number" }),
        new RouteManualData({ name: "index2", description: "Pokémon party index to swap with", type: "number", optional: true, default: "1" }),
        new RouteManualData({ name: "description", description: "A brief description", optional: true })
      ]
    },
    {
      key: "use-tm",
      title: "Use TM or HM",
      type: "RouteAction",
      rf1Code: [
        "TM: <tm|hm> [<party index> [<move index>]] [:: <description>]"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "tm|hm", description: "TM or HM to use" }),
        new RouteManualData({ name: "party index", description: "The pokemon party index to use this on", type: "number", optional: true, default: "1" }),
        new RouteManualData({ name: "move index", description: "The index of the Pokémon's move to replace.\nIf not given, it will try to add the move to the moveset if possible", type: "number", optional: true, default: "-1" }),
        new RouteManualData({ name: "description", description: "A brief description", optional: true })
      ]
    },
    {
      key: "use-item",
      title: "Use item (not fully implemented yet)",
      type: "RouteAction",
      rf1Code: [
        "Use: <item> [<count> [<party index> [<move index>]]] [:: <description>]"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "item", description: "The item to use" }),
        new RouteManualData({
          name: "count", description: "How much to use of it", type: "number", optional: true, default: "1", options: [
            { value: "A number", comment: "Will try to use that many" },
            { value: "*", comment: "Will use every remaining of that item" },
            { value: "?", comment: "Won't use anything, but can be used as an indicator for the runner" }
          ]
        }),
        new RouteManualData({ name: "party index", description: "The pokemon party index to try to use this on", type: "number", optional: true, default: "1" }),
        new RouteManualData({ name: "move index", description: "The index of the Pokémon's move to try to use this on", type: "number", optional: true, default: "1" }),
        new RouteManualData({ name: "description", description: "A brief description", optional: true })
      ]
    },
    {
      key: "toss-item",
      title: "Toss item (not implemented yet)",
      type: "RouteAction",
      rf1Code: [
        "Toss: <item> [<count>] [:: <description>]"
      ].join('\n'),
      params: [
        new RouteManualData({ name: "item", description: "The item to toss" }),
        new RouteManualData({
          name: "count", description: "How much to use of it", type: "number", optional: true, default: "1", options: [
            { value: "A number", comment: "Will try to toss that many" },
            { value: "*", comment: "Will toss every remaining of that item" },
            { value: "?", comment: "Won't toss anything, but can be used as an indicator for the runner" }
          ]
        }),
        new RouteManualData({ name: "description", description: "A brief description", optional: true })
      ]
    },
  ]);

  static get styles() {
    return css`
      ${super.styles}
      li.toc {
        cursor: pointer;
      }
      li.toc:hover {
        text-decoration: underline;
      }
      section {
        padding-bottom: 15px;
      }
      .code-lines {
        list-style-type: none;
        padding: 0px;
      }
      
      .manual-entry > h4 {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .manual-entry > .note[hidden] {
        display: none;
      }
      .manual-entry > .route-code {
        padding: 1em;
        border-radius: .5em;
        background-color: rgba(0, 0, 0, .1);
        border: 1px solid rgba(0, 0, 0, .2);
      }
      .manual-entry > .route-code > code {
        white-space: pre-wrap;
        tab-size: 4;
      }
    `;
  }

  _render() {
    return html`
      <h2>Help</h2>
      <section id="s-toc">
        <h3>Table of Contents</h3>
        <ul>
          <li class="toc" @click="${() => this.shadowRoot.getElementById("s-route-file").scrollIntoView()}">Route file</li>
          <ul class="sub">
            ${this.routeManual.getValues().filter(m => m.type == "Route").map(m => html`<li class="toc" @click="${() => this.shadowRoot.getElementById(m.key).scrollIntoView()}">${m.title}</li>`)}
          </ul>
          <li class="toc" @click="${() => this.shadowRoot.getElementById("s-route-entries").scrollIntoView()}">Route entries</li>
          <ul class="sub">
            ${this.routeManual.getValues().filter(m => m.type == "RouteEntry").map(m => html`<li class="toc" @click="${() => this.shadowRoot.getElementById(m.key).scrollIntoView()}">${m.title}</li>`)}
          </ul>
          <li class="toc" @click="${() => this.shadowRoot.getElementById("s-route-actions").scrollIntoView()}">Route actions</li>
          <ul class="sub">
            ${this.routeManual.getValues().filter(m => m.type == "RouteAction").map(m => html`<li class="toc" @click="${() => this.shadowRoot.getElementById(m.key).scrollIntoView()}">${m.title}</li>`)}
          </ul>
        </ul>
      </section>

      <section id="s-route-notes"></section>
        <psr-router-note>Use tabs!</psr-router-note>
        <psr-router-note>If you want an example of any of this, just export an example route.</psr-router-note>
      </section>
      <section id="s-route-file">
        <h3>Route file</h3>
        ${this.routeManual.getValues().filter(m => m.type == "Route").map(m => this.renderManualEntry(m))}
      </section>
      <section id="s-route-entries">
        <h3>Route entries</h3>
        ${this.routeManual.getValues().filter(m => m.type == "RouteEntry").map(m => this.renderManualEntry(m))}
      </section>
      <section id="s-route-actions">
        <h3>Route actions</h3>
        ${this.routeManual.getValues().filter(m => m.type == "RouteAction").map(m => this.renderManualEntry(m))}

      </section>
    `;
  }

  private renderManualEntry(entry: RouteManualEntry) {
    return html`
      <div class="manual-entry" id="${entry.key}">
        <h4>${entry.title}
          <img src="https://material-icons.github.io/material-icons/svg/vertical_align_top/outline.svg" alt="toc" style="cursor: pointer;" @click="${() => this.shadowRoot.getElementById("s-toc").scrollIntoView(false)}">
          <!-- <img src="https://material-icons.github.io/material-icons/svg/arrow_upward/outline.svg" alt="top"> -->
          <!-- <img src="https://material-icons.github.io/material-icons/svg/keyboard_double_arrow_up/outline.svg" alt="top"> -->
        </h4>
        <p class="description">${entry.description}</p>
        <psr-router-note class="note" ?hidden="${!entry.note}">${entry.note}</psr-router-note>
        <p class="route-code"><code>${entry.rf1Code}</code></p>
        <psr-router-manual-table .data="${entry.params}"></psr-router-manual-table>
      </div>
    `;
  }
}
