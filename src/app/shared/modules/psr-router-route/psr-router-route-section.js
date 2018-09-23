// imports
import { RouterMessage, RouterMessageType } from 'SharedModules/psr-router-util';
import { RouteEntry, RouteDescription } from 'SharedModules/psr-router-route';

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
   * @param {string}        [type="SECTION"]    The type of route entry.
   */
  constructor(game, title="", description="", location=undefined, children=[], type="SECTION") {
    super(game, title, description, location, children, type);
  }

  apply(player) {
    return super.apply(player);
  }

  /**
   * Add a new child entry.
   * @param {string}        [title=""]        A title for this entry.
   * @param {string}        [description=""]  A description for this entry.
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @param {RouteEntry[]}  [children=[]]     The child entries of this entry.
   * @param {string}        [type="ENTRY"]    The type of route entry.
   * @returns {RouteEntry} The added entry.
   */
  addNewEntry(title="", description="", location=undefined, children=[], type="ENTRY") {
    return super._addEntry(new RouteEntry(this.game, title, description, location ? location : this._location, children, type));
  }

  /**
   * Add a new child entry.
   * @param {string}        title             A title for this entry.
   * @param {string}        [description=""]  A description for this entry.
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @param {RouteEntry[]}  [children=[]]     The child entries of this entry.
   * @returns {RouteSection} The added entry.
   */
  addNewSection(title, description="", location=undefined, children=[]) {
    return super._addEntry(new RouteSection(this.game, title, description, location ? location : this._location, children));
  }

  /**
   * Add a new child entry.
   * @param {string}        description       A description for this entry.
   * @param {Location}      [location]        The location in the game where this entry occurs.
   * @returns {RouteSection} The added entry.
   */
  addNewDescription(description, location=undefined) {
    return super._addEntry(new RouteDescription(this.game, description, location ? location : this._location));
  }
}

export { RouteSection };
