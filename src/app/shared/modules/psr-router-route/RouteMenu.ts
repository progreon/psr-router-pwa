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

    // TODO

    super._playerAfter = player;
    return player;
  }

  getJSONObject(): EntryJSON {
    let obj = super.getJSONObject();
    obj.properties.actions = [];
    this.actions.forEach(action => {
      console.log(action);
      obj.properties.actions.push({
        action: action.type.key,
        description: action.description,
        item1: action.item1.key,
        item2: action.item2.key,
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

    obj.properties.actions.forEach((ma: { type: string, description: string, item1: string, item2: string, index1: number, index2: number, count: number }) => {
      if (ma.type && !RouteMenu.Type.ALL[ma.type.toUpperCase()]) {
        messages.push(new RouterMessage("Action '" + ma.type + "' is not known, falling back to default action", RouterMessage.Type.Warning));
      }
      let aType = RouteMenu.Type.ALL[ma.type] || RouteMenu.Type.DEFAULT;
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
        player.useItem(action.item1, action.index1, action.index2);
        entry.addMessage(new RouterMessage("USE action not fully implemented yet", RouterMessage.Type.Warning));
        return player;
      }
    );

    public static readonly SWAP = new Type(
      "Swap",
      (player, action, entry) => {
        // TODO
        entry.addMessage(new RouterMessage("SWAP action not implemented yet", RouterMessage.Type.Warning));
        return player;
      }
    );

    public static readonly TEACH = new Type(
      "Teach",
      (player, action, entry) => {
        // TODO
        entry.addMessage(new RouterMessage("TEACH action not implemented yet", RouterMessage.Type.Warning));
        return player;
      }
    );

    public static readonly TOSS = new Type(
      "Toss",
      (player, action, entry) => {
        // TODO
        entry.addMessage(new RouterMessage("TOSS action not implemented yet", RouterMessage.Type.Warning));
        return player;
      }
    );

    public static readonly DESCRIPTION = new Type(
      "D",
      (player, action, entry) => player,
      true
    );

    constructor(
      public readonly key: string,
      public apply: (player: Model.Player, action: Action, entry: RouteMenu) => Model.Player,
      public isDefault = false
    ) {
      Type.ALL[key.toUpperCase()] = this;
      if (isDefault) Type.DEFAULT = this;
    }
  }

  export class Action {
    constructor(
      public type: Type,
      public description: string,
      public item1: Model.Item,
      public item2: Model.Item,
      public index1 = 0,
      public index2 = 0,
      public count = 1
    ) { }

    public apply(player: Model.Player, entry: RouteMenu): Model.Player {
      return this.type.apply(player, this, entry);
    }
  }
}