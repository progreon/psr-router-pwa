'use strict';

// imports
import { RouterMessage } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteEntry } from '.';
import * as Model from 'SharedModules/psr-router-model/Model';
import * as ModelAbstract from 'SharedModules/psr-router-model/ModelAbstract';
import { EntryJSON } from './parse/EntryJSON';
// import * as Model1 from 'SharedModules/psr-router-model/Model1';

/**
 * A class representing a route-entry that does a menu sequence.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 */
export class RouteMenu extends RouteEntry {
  public static readonly ENTRY_TYPE: string = "Menu";
  public readonly actions: RouteMenu.Action[];
  /**
   *
   * @param game        The Game object this route entry uses.
   * @param actions     The menu actions that happen.
   * @param info        The info for this entry.
   * @param location    The location in the game where this entry occurs.
   */
  constructor(game: Model.Game, actions: RouteMenu.Action[], info: RouteEntryInfo = null, location: Model.Location = null) {
    super(game, info, location);
    this.actions = actions;
  }

  public get entryType(): string {
    return RouteMenu.ENTRY_TYPE;
  }

  apply(player?: Model.Player): Model.Player {
    player = super.apply(player);

    this.actions.forEach(action => player = action.apply(player, this));

    super._playerAfter = player;
    return player;
  }

  getJSONObject(): EntryJSON {
    let obj = super.getJSONObject();
    obj.properties.actions = [];
    this.actions.forEach(action => {
      obj.properties.actions.push({
        type: action.type.key,
        description: action.description,
        item1: action.item1 && action.item1.key,
        item2: action.item2 && action.item2.key,
        index1: action.index1,
        index2: action.index2,
        count: action.count
      });
    })
    return obj;
  }

  static newFromJSONObject(obj: EntryJSON, game: Model.Game): RouteMenu {
    let messages: RouterMessage[] = [];
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let location = undefined; // TODO, parse from obj.location
    let actions: RouteMenu.Action[] = [];

    obj.properties.actions.forEach((ma: { type: string, description: string, item1: string, item2: string, index1: number, index2: number, count: string }) => {
      let aType = RouteMenu.Type.ALL[ma.type.toUpperCase()] || RouteMenu.Type.DEFAULT;
      let aItem1 = game.findItemByName(ma.item1);
      let aItem2 = game.findItemByName(ma.item2);
      let action = new RouteMenu.Action(aType, ma.description, aItem1, aItem2, ma.index1, ma.index2, ma.count);
      actions.push(action);
    });

    let entry = new RouteMenu(game, actions, info, location);
    messages.forEach(m => entry.addMessage(m));
    return entry;
  }
}

export namespace RouteMenu {
  export class Type {
    static ALL: { [key: string]: Type } = {};
    static DEFAULT: Type;

    public static readonly USE = new Type(
      "Use",
      (player, action, entry) => {
        if (!action.item1) {
          entry.addMessage(new RouterMessage("No item defined", RouterMessage.Type.Error));
          return { player, actionString: "[Use error]" };
        }
        let actionString = `Use ${action.count == '0' ? "all " : ""}${action.item1.name}`;
        if (+action.count > 1) {
          actionString = `${actionString} ${action.count} times`;
        }
        if (action.item1.isUsedOnPokemon()) {
          if (!player.team[action.index1]) {
            entry.addMessage(new RouterMessage("Party index out of range: " + action.index1, RouterMessage.Type.Error));
            return { player, actionString };
          }
          actionString = `${actionString} on ${player.team[action.index1]}`;
          if (action.item1.isUsedOnMove()) {
            if (action.index2 >= 0 && action.index2 < player.team[action.index1].moveset.length) {
              actionString = `${actionString}, on ${player.team[action.index1].moveset[action.index2]}`;
            } else {
              entry.addMessage(new RouterMessage("Move index out of range: " + action.index2, RouterMessage.Type.Error));
            }
          }
        }
        if (action.count == "?") {
          actionString = `${actionString}?`;
        }
        let result = player.useItem(action.item1, action.index1, action.index2);
        if (result) {
          let i = 1, count = action.count == "0" ? player.getItemCount(action.item1) : action.count;
          while (result && i < +count) {
            result = player.useItem(action.item1, action.index1, action.index2);
            i++;
          }
          if (i == +count) result = true;
        }
        if (!result) {
          entry.addMessage(new RouterMessage("Unable to use " + action.item1.toString() + (+action.count > 1 ? action.count + " times" : "") + (!!action.item1.type && " on " + player.team[action.index1].toString() || " here") + ", do you have it?", RouterMessage.Type.Error));
        }
        // entry.addMessage(new RouterMessage("USE action not fully implemented yet", RouterMessage.Type.Warning));
        return { player, actionString }; // TODO
      }
    );

    public static readonly SWAP = new Type(
      "Swap",
      (player, action, entry) => {
        // TODO: implement GetI-entry first
        let actionString = `Swap ${action.item1?.name || "slot " + (+action.index1 + 1)} with ${action.item2?.name || "slot " + (+action.index2 + 1)}`;
        entry.addMessage(new RouterMessage("SWAP action not implemented yet", RouterMessage.Type.Warning));
        return { player, actionString }; // TODO
      }
    );

    public static readonly SWAPP = new Type(
      "SwapP",
      (player, action, entry) => {
        let actionString;
        if (action.index1 >= 0 && action.index1 < player.team.length && action.index2 >= 0 && action.index2 < player.team.length) {
          actionString = `Swap ${player.team[action.index1]} with ${player.team[action.index2]}`;
          player.swapBattlers(action.index1, action.index2);
        } else {
          actionString = "[Swap error]";
          entry.addMessage(new RouterMessage("Invalid party indices (ignoring)", RouterMessage.Type.Error));
        }
        return { player, actionString };
      }
    );

    public static readonly TEACH = new Type(
      "Teach",
      (player, action, entry) => {
        // TODO: generate actionString
        return Type.USE.apply(player, action, entry);
        // return { player, actionString: "" }; // TODO
      }
    );

    public static readonly TOSS = new Type(
      "Toss",
      (player, action, entry) => {
        // TODO: implement GetI-entry first
        let actionString = `Toss ${action.count == "0" ? "all" : action.count} ${action.item1.name}`;
        entry.addMessage(new RouterMessage("TOSS action not implemented yet", RouterMessage.Type.Warning));
        return { player, actionString }; // TODO
      }
    );

    public static readonly DESCRIPTION = new Type(
      "D",
      (player, action, entry) => { return { player, actionString: "" } },
      true
    );

    constructor(
      public readonly key: string,
      public apply: (player: Model.Player, action: Action, entry: RouteMenu) => { player: Model.Player, actionString: string },
      public isDefault = false
    ) {
      Type.ALL[key.toUpperCase()] = this;
      if (isDefault) Type.DEFAULT = this;
    }
  }

  export class Action {
    private actionString: string;
    constructor(
      public type: Type,
      public description: string,
      public item1: Model.Item,
      public item2: Model.Item,
      public index1 = 0,
      public index2 = 0,
      public count = "1"
    ) { }

    public apply(player: Model.Player, entry: RouteMenu): Model.Player {
      let result = this.type.apply(player, this, entry);
      this.actionString = result.actionString;
      return result.player;
    }

    public toString(): string {
      if (this.actionString && this.description) {
        return this.actionString + ": " + this.description;
      } else {
        return this.actionString || this.description || this.type.key; // TODO
      }
    }
  }
}