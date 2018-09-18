'use strict';

// JS Imports
import { GetGame } from 'SharedModules/psr-router-data/psr-router-data';
import * as Model from 'SharedModules/psr-router-model';
import * as Util from 'SharedModules/psr-router-util';
import * as Route from 'SharedModules/psr-router-route';

/**
 * Get a dummy route.
 * @param {Game} game
 * @returns {RouteEntry}
 */
export function GetDummyRoute(game) {
  var route = new Route.RouteEntry(game, "Red Any% Glitchless - Exarion Route");
    var srNew = new Route.RouteEntry(game, "New Game");
    srNew.addEntry(new Route.RouteEntry(game, "", "Clear any existing save file by pressing Up + B + Select on the game title screen"));
    srNew.addEntry(new Route.RouteEntry(game, "", "New game: text speed fast, animations off, style shift"));
    srNew.addEntry(new Route.RouteEntry(game, "", "Start a new game, and name yourself and your rival a one character name"));
  route.addEntry(srNew);
    var srPallet = new Route.RouteEntry(game, "Pallet Town", "It's time to get rolling!");
    srPallet.addEntry(new Route.RouteEntry(game, "", "Exit out of your home, and head north towards Route 1. Prof. Oak will stop you and lead you back to his lab. After he and your rival are done talking, select the middle Pokeball on the table to get Squirtle. Name it a one character name, and go to head out of the lab."));
    srPallet.addEntry(new Route.RouteEntry(game, "Get Pokemon", "#squirtle:5"));
    srPallet.addEntry(new Route.RouteEntry(game, "", "Your rival will stop you for a battle."));
    srPallet.addEntry(new Route.RouteEntry(game, "Rival 1", "Tail Whip x1-2, then Tackle until it faints."));
    srPallet.addEntry(new Route.RouteEntry(game, "", "Head out of the lab, and north to Route 1"));
  route.addEntry(srPallet);
    var srParcel = new Route.RouteEntry(game, "Getting the Parcel to Oak");
      var srR1 = new Route.RouteEntry(game, "Route 1");
      srR1.addEntry(new Route.RouteEntry(game, "Encounter", "You want to defeat an encounter here so that you have enough experience to get Lvl.8 at the Bug Catcher fight later. Only attempt to kill low level pokemon as higher levels take longer to kill."));
      srR1.addEntry(new Route.RouteEntry(game, "", "Head north through the route to Viridian City."));
    srParcel.addEntry(srR1);
    srParcel.addEntry(new Route.RouteEntry(game, "", "Head straight into the Mart and collect Oak's Parcel. Exit, and head south back to Route 1."));
    srParcel.addEntry(new Route.RouteEntry(game, "", "Head south, utilizing ledges to avoid as much grass as you can. If you have yet to kill an encounter, take the shorter route through the second-to-last grass patch; otherwise, walk around it."));
    srParcel.addEntry(new Route.RouteEntry(game, "", "Head to the lab, finish the lengthy conversation with Prof. Oak and head back north once more."));
  route.addEntry(srParcel);
    var srNidoran = new Route.RouteEntry(game, "Getting Nidoran!");
    srNidoran.addEntry(new Route.RouteEntry(game, "", "Head north to Viridian City again, remembering to kill an encounter if you haven't already."));
      var srViridian1 = new Route.RouteEntry(game, "Viridian City");
      srViridian1.addEntry(new Route.RouteEntry(game, "", "Head back into the Mart for the first shopping trip."));
      srViridian1.addEntry(new Route.RouteEntry(game, "Shop", "Buy 3-8 Poke Balls."));
      srViridian1.addEntry(new Route.RouteEntry(game, "", "Head out of the Mart, and west to Route 22."));
    srNidoran.addEntry(srViridian1);
      var srR22 = new Route.RouteEntry(game, "Route 22");
      srR22.addEntry(new Route.RouteEntry(game, "Manip", "Use a manip of your choice to get a Lv. 4 Nidoran with perfect stats, and give it a one-character name"));
      srR22.addEntry(new Route.RouteEntry(game, "", "Return to Viridian City and go north, picking up the tree potion, and entering Viridian Forest"));
    srNidoran.addEntry(srR22);
  route.addEntry(srNidoran);
    var srForest = new Route.RouteEntry(game, "Viridian Forest");
    srForest.addEntry(new Route.RouteEntry(game, "", "Avoid encounters as much as possible by walking on encounterless grass tiles."));
    srForest.addEntry(new Route.RouteEntry(game, "GetI: Antidote", "Pick up the antidote on the way up."));
    srForest.addEntry(new Route.RouteEntry(game, "GetI: Potion", "Be at least 10 HP before the Weedle Guy, and pick up the hidden Potion next to him."));
    srForest.addEntry(new Route.RouteEntry(game, "Weedle Guy", "Tail Whip x2, spam tackle. If you get poisoned, wait until after the fight to use the Antidote. If you fall below 7 HP, use a Potion."));
    srForest.addEntry(new Route.RouteEntry(game, "Swap: 0 1", "After the fight, swap Nidoran to the front, heal Squirtle to 17+ HP and heal poison if necessary."));
  route.addEntry(srForest);
    var srPewter = new Route.RouteEntry(game, "Pewter City");
    srPewter.addEntry(new Route.RouteEntry(game, "Brock", "Switch to Squirtle to share exp, use Bubble to kill Geodude and Onix. If Onix uses Bide on the turn you switch in, use Tail Whip twice, then Bubble."));
    srPewter.addEntry(new Route.RouteEntry(game, "Shop", "Change the battle style option from Shift to Set, and buy 7-10 Potions."));
  route.addEntry(srPewter);

  return route;
}
