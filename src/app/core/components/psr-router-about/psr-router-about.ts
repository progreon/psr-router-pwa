// JS Imports
import { html } from 'lit-element';
import { PsrRouterPage } from '../psr-router-page/psr-router-page';

class PsrRouterAbout extends PsrRouterPage {
  _render() {
    return html`
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
          <li>Edge: Really slow, no offline support, not recommended</li>
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
        <h3>0.0.2 - ...</h3>
        <ul>
          <li>More data!</li>
          <ul>
            <li>Added pokémon, trainer and move info for Pokémon Yellow</li>
            <li>[TEMP] Added dummy route for Pokémon Yellow</li>
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
