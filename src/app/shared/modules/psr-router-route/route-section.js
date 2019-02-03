'use strict';

// imports
import { RouterMessage, RouterMessageType } from '../psr-router-util';
import { RouteBattle, RouteDirections, RouteEntry, RouteGetPokemon } from '.';
import { RouteEntryInfo } from './util';

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
   * @todo children in here and not in entry
   */
  constructor(game, info, location=undefined, children=[]) {
    super(game, info, location);
    /**
     * @type {RouteEntry[]}
     * @private
     */
    this._children = children;
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

  /**
   * Get only the direct children.
   * @returns {RouteEntry[]} The list of direct children.
   */
  getChildren() {
    return this._children;
  }

  /**
   * Gets all of its entries, including itself as the first one.
   * @returns {RouteEntry[]} The entry list.
   */
  getEntryList() {
    var entryList = [this];

    if (this._children)
      this._children.forEach(c => {entryList.push(...c.getEntryList())})

    return entryList;
  }

  /**
   * Add a child entry.
   * @param {RouteEntry}  entry
   * @param {Function}    [observer]
   * @returns {RouteEntry} The added entry.
   * @protected
   * @todo refresh?
   */
  _addEntry(entry, observer) {
    this._children.push(entry);
    if (observer)
      entry.addObserver(observer);
    this._fireDataUpdated();
    return entry;
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
    this._children.push(entry);
    return entry;
  }

  /**
   * Add a new battle entry.
   * @param {trainer}       trainer         The trainer to battle against.
   * @param {string}        [title=""]      A title for this entry.
   * @param {string}        [summary=""]    A summary for this entry.
   * @param {string}        [description=""]  A long description.
   * @param {Location}      [location]      The location in the game where this entry occurs.
   * @returns {RouteBattle} The added entry.
   * @todo
   */
  addNewBattle(trainer, title="", summary="", description="", location=undefined) {
    return this._addEntry(new RouteBattle(this.game, trainer, new RouteEntryInfo(title, summary, description), location ? location : this._location));
  }

  /**
   * Add new directions.
   * @param {string}        summary           The directions summary.
   * @param {string}        [description=""]  A long description.
   * @param {string}        [imageUrl=""]     A link to an image (e.g. imgur).
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @returns {RouteSection} The added entry.
   */
  addNewDirections(summary, description="", location=undefined) {
    return this._addEntry(new RouteDirections(this.game, new RouteEntryInfo("", summary, description), location ? location : this._location));
  }

  /**
   * Add a new child entry.
   * @param {string}        [title=""]        A title for this entry.
   * @param {string}        [summary=""]      A summary for this entry.
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @returns {RouteEntry} The added entry.
   */
  addNewEntry(title="", summary="", description="", location=undefined) {
    return this._addEntry(new RouteEntry(this.game, new RouteEntryInfo(title, summary, description), location ? location : this._location));
  }

  /**
   * Add a new pokemon entry.
   * @param {Object}        choices           The pokemon to choose from.
   * @param {number}        [preference=0]    The preferred choices.
   * @param {string}        [title=""]        A title for this entry.
   * @param {string}        [summary=""]      A summary for this entry.
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @returns {RouteGetPokemon} The added entry.
   * @todo
   */
  addNewGetPokemon(choices, preference, title="", summary="", location=undefined) {
    return this._addEntry(new RouteGetPokemon(this.game, choices, preference, new RouteEntryInfo(title, summary), undefined, undefined, location ? location : this._location));
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

  getJSONObject() {
    var obj = super.getJSONObject();
    obj.entries = [];
    this._children.forEach(c => obj.entries.push(c.getJSONObject()));
    return obj;
  }

  static newFromJSONObject(game, obj) {
    var info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    var children = [];
    obj.entries.forEach(e => {
      var type = e.type && e.type.toUpperCase();
      switch (type) {
        case RouteBattle.getEntryType().toUpperCase():
          children.push(RouteBattle.newFromJSONObject(game, e));
          break;
        case RouteEntry.getEntryType().toUpperCase():
          children.push(RouteEntry.newFromJSONObject(game, e));
          break;
        case RouteGetPokemon.getEntryType().toUpperCase():
          children.push(RouteGetPokemon.newFromJSONObject(game, e));
          break;
        case RouteSection.getEntryType().toUpperCase():
          children.push(RouteSection.newFromJSONObject(game, e));
          break;
        case RouteDirections.getEntryType().toUpperCase():
        default:
          children.push(RouteDirections.newFromJSONObject(game, e));
      }
    });

    var location = undefined; // TODO, parse from obj.location
    return new RouteSection(game, info, location, children);
  }
}

export { RouteSection };
