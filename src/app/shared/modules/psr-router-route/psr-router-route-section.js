'use strict';

// imports
import { RouterMessage, RouterMessageType } from 'SharedModules/psr-router-util';
import { RouteBattle, RouteDirections, RouteEntry, RouteGetPokemon } from 'SharedModules/psr-router-route';
import { GetEntryListFromLines } from './psr-router-route-parser';

/**
 * A class representing a route-setions that holds multiple child entries.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 * @augments RouteEntry
 */
class RouteSection extends RouteEntry {
  /**
   *
   * @param {Game}          game              The Game object this route entry uses.
   * @param {string}        [title=""]        A title for this entry.
   * @param {string}        [description=""]  A description for this entry.
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @param {RouteEntry[]}  [children=[]]     The child entries of this entry.
   */
  constructor(game, title="", description="", location=undefined, children=[]) {
    super(game, title, description, location, children);
  }

  static getEntryType() {
    return "S";
  }

  apply(player) {
    return super.apply(player);
  }

  /**
   * Add a new battle entry.
   * @param {string}        entryString       TEMP
   * @param {string}        [title=""]        A title for this entry.
   * @param {string}        [description=""]  A description for this entry.
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @returns {RouteBattle} The added entry.
   * @todo
   */
  addNewBattle(entryString, title="", description="", location=undefined) {
    return super._addEntry(new RouteBattle(this.game, entryString, title, description, undefined, undefined, location ? location : this._location));
  }

  /**
   * Add new directions.
   * @param {string}        description       A description for this entry.
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @returns {RouteSection} The added entry.
   */
  addNewDirections(description, location=undefined) {
    return super._addEntry(new RouteDirections(this.game, description, location ? location : this._location));
  }

  /**
   * Add a new child entry.
   * @param {string}        [title=""]        A title for this entry.
   * @param {string}        [description=""]  A description for this entry.
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @param {RouteEntry[]}  [children=[]]     The child entries of this entry.
   * @returns {RouteEntry} The added entry.
   */
  addNewEntry(title="", description="", location=undefined, children=[]) {
    return super._addEntry(new RouteEntry(this.game, title, description, location ? location : this._location, children));
  }

  /**
   * Add a new pokemon entry.
   * @param {string}        entryString       TEMP
   * @param {string}        [title=""]        A title for this entry.
   * @param {string}        [description=""]  A description for this entry.
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @returns {RouteGetPokemon} The added entry.
   * @todo
   */
  addNewGetPokemon(entryString, title="", description="", location=undefined) {
    return super._addEntry(new RouteGetPokemon(this.game, entryString, title, description, undefined, undefined, location ? location : this._location));
  }

  /**
   * Add a new section.
   * @param {string}        title             A title for this entry.
   * @param {string}        [description=""]  A description for this entry.
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @param {RouteEntry[]}  [children=[]]     The child entries of this entry.
   * @returns {RouteSection} The added entry.
   */
  addNewSection(title, description="", location=undefined, children=[]) {
    return super._addEntry(new RouteSection(this.game, title, description, location ? location : this._location, children));
  }

  static newFromRouteFileLines(parent, lines) {
    if (lines && lines.length > 0 && lines[0].line) {
      var line = lines[0].line;
      var title = line;
      var description = "";
      var i = line.indexOf(" :: ");
      if (i >= 0) {
        title = line.substring(0, i);
        description = line.substring(i + 4);
      }
      var routeSection = new RouteSection(parent.game, title, description, parent.getLocation());
      var childEntries = GetEntryListFromLines(parent, lines, 1);
      for (var ic = 0; ic < childEntries.length; ic++) {
        routeSection._addEntry(childEntries[ic]);
      }
      return routeSection;
    } else {
      // TODO: throw exception
    }
  }
}

export { RouteSection };
