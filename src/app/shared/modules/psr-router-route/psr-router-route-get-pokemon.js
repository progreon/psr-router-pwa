'use strict';

// imports
import { RouterMessage, RouterMessageType } from 'SharedModules/psr-router-util';
import { RouteEntry } from 'SharedModules/psr-router-route';

/**
 * A class representing a route-entry that gets you a pokemon out of a list of possible pokemon.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 * @augments RouteEntry
 */
class RouteGetPokemon extends RouteEntry {
  /**
   *
   * @param {Game}        game              The Game object this route entry uses.
   * @param {string}      [title=""]        A title for this entry.
   * @param {string}      [description=""]  A description for this entry.
   * @param {Battler[]}   [choices=[]]      The different battlers to choose from.
   * @param {number}      [preference=0]    The preferred choise.
   * @param {Location}    [location]        The location in the game where this entry occurs.
   */
  constructor(game, title="", description="", choices=[], preference=0, location=undefined) {
    super(game, title, description, location, children);
  }

  static getEntryType() {
    return "GET_P";
  }
}

export { RouteGetPokemon };
