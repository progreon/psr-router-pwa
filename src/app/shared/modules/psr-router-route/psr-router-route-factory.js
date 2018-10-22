'use strict';

// JS Imports
import { GetGame } from 'SharedModules/psr-router-data/psr-router-data';
import * as Model from 'SharedModules/psr-router-model';
import * as Util from 'SharedModules/psr-router-util';
import * as Route from 'SharedModules/psr-router-route';

/**
 * Get a dummy route.
 * @param {Game} game
 * @returns {Route}
 */
export function GetDummyRoute(game) {
  var route = new Route.Route(game, "Red Any% Glitchless - Exarion Route");
    var srNew = route.addNewSection("New Game");
      srNew.addNewDirections("Clear any existing save file by pressing Up + B + Select on the game title screen.");
      srNew.addNewDirections("New game: text speed fast, animations off, style shift.");
      srNew.addNewDirections("Start a new game, and name yourself and your rival a one character name.");
    var srPallet = route.addNewSection("Pallet Town", "It's time to get rolling!");
      srPallet.addNewDirections("Exit out of your home, and head north towards Route 1. Prof. Oak will stop you and lead you back to his lab. After he and your rival are done talking, select the middle Pokeball on the table to get Squirtle. Name it a one character name, and go to head out of the lab.");
      srPallet.addNewGetPokemon("#squirtle:5", "", "Get Squirtle");
      srPallet.addNewDirections("Your rival will stop you for a battle.");
      srPallet.addNewBattle("rival1", "Rival 1", "Tail Whip x1-2, then Tackle until it faints.");
      srPallet.addNewDirections("Head out of the lab, and north to Route 1", "Here there can be a really, really long explanation on how to walk from the lab to route 1, getting the parcel, going back to oak and giving him the parcel.\nAlso with an image: [[https://i.imgur.com/qayAQtA.jpg]]\nAfter this you will get your pokemon and live happily ever after :D");
    var srParcel = route.addNewSection("Getting the Parcel to Oak");
      var srR1 = srParcel.addNewSection("Route 1");
        srR1.addNewEntry("Encounter", "You want to defeat an encounter here so that you have enough experience to get Lvl.8 at the Bug Catcher fight later. Only attempt to kill low level pokemon as higher levels take longer to kill.");
        srR1.addNewDirections("Head north through the route to Viridian City.");
      srParcel.addNewDirections("Head straight into the Mart and collect Oak's Parcel. Exit, and head south back to Route 1.");
      srParcel.addNewDirections("Head south, utilizing ledges to avoid as much grass as you can. If you have yet to kill an encounter, take the shorter route through the second-to-last grass patch; otherwise, walk around it.");
      srParcel.addNewDirections("Head to the lab, finish the lengthy conversation with Prof. Oak and head back north once more.");
    var srNidoran = route.addNewSection("Getting Nidoran!");
      srNidoran.addNewDirections("Head north to Viridian City again, remembering to kill an encounter if you haven't already.");
      var srViridian1 = srNidoran.addNewSection("Viridian City");
        srViridian1.addNewDirections("Head back into the Mart for the first shopping trip.");
        srViridian1.addNewEntry("Shop", "Buy 3-8 Poke Balls.");
        srViridian1.addNewDirections("Head out of the Mart, and west to Route 22.");
      var srR22 = srNidoran.addNewSection("Route 22");
        srR22.addNewEntry("Manip", "Use a manip of your choice to get a Lv. 4 Nidoran with perfect stats, and give it a one-character name");
        srR22.addNewDirections("Return to Viridian City and go north, picking up the tree potion, and entering Viridian Forest");
    var srForest = route.addNewSection("Viridian Forest");
      srForest.addNewDirections("Avoid encounters as much as possible by walking on encounterless grass tiles.");
      srForest.addNewEntry("GetI: Antidote", "Pick up the antidote on the way up.");
      srForest.addNewEntry("GetI: Potion", "Be at least 10 HP before the Weedle Guy, and pick up the hidden Potion next to him.");
      srForest.addNewBattle("bug1", "Weedle Guy", "Tail Whip x2, spam tackle. If you get poisoned, wait until after the fight to use the Antidote. If you fall below 7 HP, use a Potion.");
      srForest.addNewEntry("Swap: 0 1", "After the fight, swap Nidoran to the front, heal Squirtle to 17+ HP and heal poison if necessary.");
    var srPewter = route.addNewSection("Pewter City");
      srPewter.addNewBattle("brock :: 0:0 0:1 1:0 1:1", "Brock", "Switch to Squirtle to share exp, use Bubble to kill Geodude and Onix. If Onix uses Bide on the turn you switch in, use Tail Whip twice, then Bubble.");
      srPewter.addNewEntry("Shop", "Change the battle style option from Shift to Set, and buy 7-10 Potions.");

  return route;
}
