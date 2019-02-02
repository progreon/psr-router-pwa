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
    var obj = super.getJSONObject();
    obj.trainer = this.trainer.alias || this.trainer.key;
    if (this.shareExp) {
      obj.shareExp = this.shareExp;
    }
    return obj;
  }

  static newFromJSONObject(game, obj) {
    var trainer;
    var shareExp;
    if (obj.entryString) {
      var split = obj.entryString.split("::");
      trainer = game.findTrainerByKeyOrAlias(split[0].trim());
      if (split.length > 1) {
        shareExp = [];
        trainer.party.forEach(p => shareExp.push([]));
        var battleString = split[1].trim().split(" ");
        battleString.forEach(bs => {
          var [o, p] = bs.split(":");
          if (o < trainer.party.length) {
            shareExp[o].push(parseInt(p));
          }
        });
      }
    } else {
      trainer = game.findTrainerByKeyOrAlias(obj.trainer);
      shareExp = obj.shareExp;
    }
    var location = undefined; // TODO, parse from obj.location
    var info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    return new RouteBattle(game, trainer, info, location, shareExp);
  }
}

export { RouteBattle };
