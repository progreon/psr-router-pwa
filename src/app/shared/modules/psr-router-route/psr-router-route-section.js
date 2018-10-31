'use strict';

// imports
import { RouterMessage, RouterMessageType } from 'SharedModules/psr-router-util';
import { RouteEntryInfo, RouteBattle, RouteDirections, RouteEntry, RouteGetPokemon } from 'SharedModules/psr-router-route';
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
   * @param {Game}            game            The Game object this route entry uses.
   * @param {RouteEntryInfo}  info            The info for this entry.
   * @param {Location}        [location]      The location in the game where this entry occurs.
   * @param {RouteEntry[]}    [children=[]]   The child entries of this entry.
   */
  constructor(game, info, location=undefined, children=[]) {
    super(game, info, location, children);
  }

  static getEntryType() {
    return "S";
  }

  /**
   * @todo TESTING!!
   *
   * @param {RouteEntry}  [child]
   */
  _applyAfterChild(child) {
    var currChildIdx = 0;
    if (child) {
      while (currChildIdx < this._children.length && this._children[currChildIdx] !== child) {
        currChildIdx++;
      }
    } else if (this._children.length > 0) {
      this._children[0].apply(super.getPlayerAfter());
    }
    while (currChildIdx + 1 < this._children.length) {
      this._children[currChildIdx + 1].apply(this._children[currChildIdx].getPlayerAfter());
      currChildIdx++;
    }
    this._fireDataUpdated();
    return this.getPlayerAfter();
  }

  /**
   * Only for use during an update event!
   *
   * @param {RouteEntry}  child
   * @param {String}      type  data, player, ...
   * @private
   */
  _childChanged(child, type) {
    if (type === "player") {
      this._applyAfterChild(child);
      this._firePlayerUpdated();
    }
  }

  apply(player) {
    super.apply(player);
    return this._applyAfterChild();
  }

  getPlayerAfter() {
    if (this._children.length > 0) {
      return this._children[this._children.length - 1].getPlayerAfter();
    } else {
      return super.getPlayerAfter();
    }
  }

  _addEntry(entry) {
    entry.addObserver(this._childChanged.bind(this));
    super._addEntry(entry);
    return entry;
  }

  /**
   * Add a new battle entry.
   * @param {string}        entryString     TEMP
   * @param {string}        [title=""]      A title for this entry.
   * @param {string}        [summary=""]    A summary for this entry.
   * @param {Location}      [location]      The location in the game where this entry occurs.
   * @returns {RouteBattle} The added entry.
   * @todo
   */
  addNewBattle(entryString, title="", summary="", description="", location=undefined) {
    return this._addEntry(new RouteBattle(this.game, entryString, new RouteEntryInfo(title, summary, description), location ? location : this._location));
  }

  /**
   * Add new directions.
   * @param {string}        summary       The directions summary.
   * @param {string}        [description=""]    A long description.
   * @param {string}        [imageUrl=""]     A link to an image (e.g. imgur).
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @returns {RouteSection} The added entry.
   */
  addNewDirections(summary, description="", imageUrl="", location=undefined) {
    return this._addEntry(new RouteDirections(this.game, new RouteEntryInfo("", summary, description, imageUrl ? [imageUrl] : []), location ? location : this._location));
  }

  /**
   * Add a new child entry.
   * @param {string}        [title=""]        A title for this entry.
   * @param {string}        [summary=""]      A summary for this entry.
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @param {RouteEntry[]}  [children=[]]     The child entries of this entry.
   * @returns {RouteEntry} The added entry.
   */
  addNewEntry(title="", summary="", description="", location=undefined, children=[]) {
    return this._addEntry(new RouteEntry(this.game, new RouteEntryInfo(title, summary, description), location ? location : this._location, children));
  }

  /**
   * Add a new pokemon entry.
   * @param {string}        entryString       TEMP
   * @param {string}        [title=""]        A title for this entry.
   * @param {string}        [summary=""]      A summary for this entry.
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @returns {RouteGetPokemon} The added entry.
   * @todo
   */
  addNewGetPokemon(entryString, title="", summary="", location=undefined) {
    return this._addEntry(new RouteGetPokemon(this.game, entryString, new RouteEntryInfo(title, summary), undefined, undefined, location ? location : this._location));
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
    return this._addEntry(new RouteSection(this.game, new RouteEntryInfo(title, description), location ? location : this._location, children));
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
      var routeSection = new RouteSection(parent.game, new RouteEntryInfo(title, description), parent.getLocation());
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
