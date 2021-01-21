// JS Imports
import { html } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

class PsrRouterAbout extends PsrRouterPage {
  _render() {
    return html`
      <style>
        section {
          padding-bottom: 15px;
        }
      </style>
      <h2>About</h2>
      <p>Current version: ${window.MyAppGlobals.version}</p>
      <section>
        <h3>Welcome to the Pokémon Speedruns Router application!</h3>
        <p>Work In Progress!</p>
        <p>This application can be used to view and follow along existing routes and create your own ones as well.
        Future versions will include damage calculations, support for multiple games & generations, and much more!</p>
        <p>So hold on tight and enjoy the wonderful ride that is Pokémon Speedruns ;)</p>
      </section>
      <section>
        <h3>Browser Support</h3>
        <ul>
          <li>Chrome: The best, recommended</li>
          <li>Firefox: Tiny bit slower</li>
          <li>Edge: Please use the chromium base version, do yourself a favor</li>
          <li>Internet Explorer: Unsupported</li>
          <li>Others: Unknown</li>
        </ul>
      </section>
      <section>
        <h3>Related Links</h3>
        <ul>
          <li>PSR on <a href="https://www.speedrun.com/pokemon" target="_blank">speedrun.com</a></li>
          <li>About the <a href="https://www.speedrun.com/pokemon/thread/r7a65" target="_blank">PSR Discord</a></li>
          <li>PSR <a href="http://wiki.pokemonspeedruns.com" target="_blank">Wiki</a></li>
          <li>Find this on <a href="https://github.com/progreon/psr-router-pwa" target="_blank">Github</a></li>
        </ul>
      </section>
      <section>
        <h3>The Creator: Progreon</h3>
        <ul>
          <li><a href="https://github.com/progreon/" target="_blank">Github</a></li>
          <li><a href="https://www.twitch.tv/progreon" target="_blank">Twitch</a></li>
          <li><a href="https://www.youtube.com/channel/UCINP2PH_LQ_HoOTCDKmEw7w" target="_blank">Youtube</a></li>
          <li><a href="https://www.speedrun.com/user/progreon" target="_blank">speedrun.com</a></li>
          <li><a href="http://www.speedrunslive.com/profiles/#!/progreon/1" target="_blank">SpeedRunsLive</a></li>
        </ul>
      </section>
      <h2>Release Notes</h2>
      <section>
        <h3>0.2.0 - Item & money management</h3>
        <ul>
          <li>Added item & money management</li>
          <ul>
            <li>GetI(tem) entry</li>
            <li>Shop entry</li>
            <li>Some menuing messages improvements (needs feedback)</li>
            <li>Error messages in case something is impossible, still tries to apply the actions for routing purposes</li>
          </ul>
          <li>Added colors for damage ranges & speed comparison in battle</li>
          <li>Some more tooltips on desktop</li>
          <ul>
            <li>Entry info</li>
            <li>Player info</li>
            <li>Move info in trainer component</li>
            <li>Some performance improvements as well</li>
          </ul>
          <li>Example route files</li>
          <ul>
            <li>Fixed the basic red route</li>
            <li>The other routes still need to be fixed</li>
            <li>Still need to add more example routes</li>
          </ul>
        </ul>
      </section>
      <section>
        <h3>0.1.1 - Some percentages</h3>
        <ul>
          <li>Added a move-tooltip</li>
          <ul>
            <li>Display the chance for each damage roll</li>
            <li>Display the kill chance for the first 3 hits</li>
          </ul>
        </ul>
      </section>
      <section>
        <h3>0.1.0 - Let's make this usable</h3>
        <ul>
          <li>Damage calculations!</li>
          <li>Added more data</li>
          <ul>
            <li>Encounters</li>
            <li>Locations</li>
            <li>Added Pokémon Yellow data</li> 
          </ul>
          <li>Big loading performance increase</li>
          <li>Added more route entry types</li>
          <ul>
            <li>Battle</li>
            <li>Manip</li>
            <li>Menu</li>
            <li>Encounter</li>
          </ul>
          <li>Added actions that can be used in entries</li>
          <ul>
            <li>Swap items</li>
            <li>Swap moves</li>
            <li>Swap pokemon</li>
            <li>Use items</li>
            <li>Teach</li>
            <li>Battler settings</li>
            <li>...</li>
          </ul>
          <li>Lots of refactoring</li>
          <li>Better app menu</li>
          <li>Added filter box to data pages</li>
          <li>Started item management</li>
          <li>Better route management (new home page)</li>
          <li>Simple page to edit a route in-app</li>
          <li>Added a player butten per entry which shows basic info</li>
          <li>New example routes</li>
          <ul>
            <li>Red Any% Glitchless [Beginner Guide]</li>
            <li>Red Any% Glitchless [race, no IT] (not fully up-to-date)</li>
          </ul>
        </ul>
      </section>
      <section>
        <h3>0.0.1 - Let's get this ball rolling!</h3>
        <ul>
          <li>Loading some example routes</li>
          <ul>
            <li>Red Any% Glitchless (Basic)</li>
            <li>Red Any% Glitchless Classic</li>
          </ul>
          <li>Load/export from/to a text file</li>
          <li>Pokémon, trainer, move and item info for Pokémon Red and Blue</li>
          <li>Progressive Web Application</li>
          <ul>
            <li>Mobile friendly (responsive)</li>
            <li>Installable on mobile & desktop (optional)</li>
            <li>Native mobile feel</li>
            <li>Fully available when offline</li>
            <li>Will update automatically</li>
          </ul>
        </ul>
      </section>
    `;
  }
}

window.customElements.define('psr-router-about', PsrRouterAbout);
