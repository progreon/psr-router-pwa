'use strict';

// imports
import { RouterMessage, RouterMessageType } from 'SharedModules/psr-router-util';
import { RouteEntryInfo, RouteEntry } from 'SharedModules/psr-router-route';

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
   * @param {Game}            game              The Game object this route entry uses.
   * @param {string}          entryString       TEMP
   * @param {RouteEntryInfo}  [info]            The info for this entry.
   * @param {Battler[]}       [choices=[]]      The different battlers to choose from.
   * @param {number}          [preference=0]    The preferred choise.
   * @param {Location}        [location]        The location in the game where this entry occurs.
   * @todo choices, preference, ...
   */
  constructor(game, entryString, info=undefined, choices=[], preference=0, location=undefined) {
    super(game, info, location);
    this.entryString = entryString;
    this._choices = choices;
    this._preference = preference;
  }

  static getEntryType() {
    return "GetP";
  }

  _getRouteFileLines(printerSettings) {
    var str = "\t";
    if (this.info.title !== "")
      str += this.info.title +  " :: ";
    str += this.info.summary;
    return [this.entryString, str];
  }

  static newFromRouteFileLines(game, lines) {
    if (lines && lines.length > 0 && lines[0].line) {
      var entryString = lines[0].line;
      var line = "", title = "", summary = "";
      if (lines.length > 1) {
        var line = lines[1].line;
        summary = line;
        var i = line.indexOf(" :: ");
        if (i >= 0) {
          title = line.substring(0, i);
          summary = line.substring(i + 4);
        }
        if (lines.length > 2) {
          // TODO: throw exception
        }
      }
      var info = new RouteEntryInfo(title, summary);
      return new RouteGetPokemon(game, entryString, info);
    } else {
      // TODO: throw exception
    }
  }

  getJSONObject() {
    var obj = super.getJSONObject();
    obj.entryString = this.entryString;
    obj.choices = this._choices;
    obj.preference = this._preference;
    return obj;
  }

  static newFromJSONObject(game, obj) {
    var info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    return new RouteGetPokemon(game, obj.entryString, info, obj.choices, obj.preference, obj.location);
  }
}

export { RouteGetPokemon };
