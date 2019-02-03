'use strict';

// imports
import { RouterMessage, RouterMessageType } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteEntry } from '.';

/**
 * A class representing a route-entry that handles battles.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 * @augments RouteEntry
 */
class RouteBattle extends RouteEntry {
  /**
   *
   * @param {Game}            game              The Game object this route entry uses.
   * @param {Trainer}         trainer           The trainer to battle against.
   * @param {Array}           [shareExp]        Which pokemon in the player's party to share exp with.
   * @param {RouteEntryInfo}  [info]            The info for this entry.
   * @param {Location}        [location]        The location in the game where this entry occurs.
   */
  constructor(game, trainer, info=undefined, location=undefined, shareExp=undefined) {
    super(game, info, location);
    this.trainer = trainer;
    this.shareExp = shareExp;
  }

  static getEntryType() {
    return "B";
  }

  getJSONObject() {
    let obj = super.getJSONObject();
    obj.trainer = this.trainer.alias || this.trainer.key;
    if (this.shareExp) {
      obj.shareExp = this.shareExp;
    }
    return obj;
  }

  static newFromJSONObject(game, obj) {
    let trainer = game.findTrainerByKeyOrAlias(obj.trainer);
    let shareExp = obj.shareExp;
    let location = undefined; // TODO, parse from obj.location
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    return new RouteBattle(game, trainer, info, location, shareExp);
  }
}

export { RouteBattle };
