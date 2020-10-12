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
  /**
   *
   * @param game        The Game object this route entry uses.
   * TODO
   * @param info        The info for this entry.
   * @param location    The location in the game where this entry occurs.
   */
  constructor(game: Model.Game, info: RouteEntryInfo = null, location: Model.Location = null) {
    super(game, info, location);
    // TODO
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
    obj.properties.choices = [];
    // TODO
    return obj;
  }

  static newFromJSONObject(obj: EntryJSON, game: Model.Game): RouteMenu {
    let messages: RouterMessage[] = [];
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let location = undefined; // TODO, parse from obj.location
    // TODO
    // let choices: ModelAbstract.Battler[] = [];
    // obj.properties.choices.forEach((pl: { pokemon: string; level: number; }) => {
    //   let pokemon = game.findPokemonByName(pl.pokemon);
    //   if (!pokemon) {
    //     pokemon = game.getDummyPokemon(pl.pokemon);
    //     if (!game.info.unsupported) {
    //       messages.push(new RouterMessage(`Pokemon "${pl.pokemon}" not found!`, RouterMessage.Type.Error));
    //     }
    //   }
    //   if (game.info.gen == 1) {
    //     choices.push(new game.model.Battler1(game, pokemon, location, false, pl.level));
    //   } else {
    //     messages.push(new RouterMessage(`Not supported in gen2+ yet!`, RouterMessage.Type.Error));
    //   }
    // });
    let entry = new RouteMenu(game, info, location);
    messages.forEach(m => entry.addMessage(m));
    return entry;
  }
}

export namespace RouteMenu {
  class Type {

    public static readonly USE = new Type(
      (player, action) => {
        player.useItem(action.item1, action.index1, action.index2);
        return player;
      }
    );

    public static readonly SWAP = new Type(
      (player, action)  => {
        // TODO
        return player;
      }
    );

    public static readonly TEACH = new Type(
      (player, action) => {
        // TODO
        return player;
      }
    );

    public static readonly TOSS = new Type(
      (player, action) => {
        // TODO
        return player;
      }
    );

    public static readonly DESCRIPTION = new Type(
      (player, action) => player
    );

    constructor(
      public apply: (player: Model.Player, action: Action) => Model.Player
    ) { }
  }

  class Action {
    // { type, description, item1, item2, index1, index2, count }
    constructor(
      public type: Type,
      public description: string,
      public item1: Model.Item,
      public item2: Model.Item,
      public index1 = 0,
      public index2 = 0,
      public count = 1
    ) { }

    public apply(player: Model.Player): Model.Player {
      return this.type.apply(player, this);
    }
  }
}