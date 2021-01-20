'use strict';

// imports
import { RouterMessage, DVRange } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteEntry } from '.';
import * as Model from 'SharedModules/psr-router-model/Model';
import * as ModelAbstract from 'SharedModules/psr-router-model/ModelAbstract';
import { EntryJSON } from './parse/EntryJSON';

/**
 * A class representing a route-entry that gets you a manipped pokemon.
 * @todo WildEncounters?
 * @todo parent?
 * @todo writeToString?
 * @todo catch location
 */
export class RouteManip extends RouteEntry {
  public static readonly ENTRY_TYPE: string = "Manip";
  public readonly battler: ModelAbstract.Battler;
  /**
   *
   * @param game        The Game object this route entry uses.
   * @param battler     The manip'd battler.
   * @param info        The info for this entry.
   * @param location    The location in the game where this entry occurs.
   */
  constructor(game: Model.Game, battler: ModelAbstract.Battler, info: RouteEntryInfo = null, location: Model.Location = null) {
    super(game, info, location);
    this.battler = battler;
  }

  public get entryType(): string {
    return RouteManip.ENTRY_TYPE;
  }

  apply(player?: Model.Player, fireApplied = true): void {
    super.apply(player, false);
    let nextPlayer = super.nextPlayer;
    nextPlayer.addBattler(this.battler.clone());
    // TEMP
    let ball = this.game.findItemByName("POKE_BALL");
    console.debug("TEMP: use POKE_BALL", nextPlayer.useItem(ball, null, null, null, true));
    super.updateNextPlayer(nextPlayer, fireApplied);
  }

  getJSONObject(): EntryJSON {
    let obj = super.getJSONObject();
    obj.properties.pokemon = this.battler.pokemon.key;
    obj.properties.level = this.battler.level;
    obj.properties.dvs = this.battler.getDVRanges().map(dvr => dvr.values.join(','));
    return obj;
  }

  static newFromJSONObject(obj: EntryJSON, game: Model.Game): RouteManip {
    let messages: RouterMessage[] = [];
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let location = undefined; // TODO, parse from obj.location
    let battler: ModelAbstract.Battler;
    let pokemon = game.findPokemonByName(obj.properties.pokemon);
    if (!pokemon) {
      pokemon = game.getDummyPokemon(obj.properties.pokemon);
      if (!game.info.unsupported) {
        messages.push(new RouterMessage(`Pokemon "${obj.properties.pokemon}" not found!`, RouterMessage.Type.Error));
      }
    }
    if (game.info.gen == 1) {
      if (!obj.properties.dvs || !Array.isArray(obj.properties.dvs) || obj.properties.dvs.length != 5) {
        messages.push(new RouterMessage(`This entry should contain 5 dv's!`, RouterMessage.Type.Error));
      } else {
        let dvRanges: DVRange[] = [];
        obj.properties.dvs.forEach(dv => {
          let dvRange = new DVRange();
          dv.split(',').forEach(d => dvRange.addDV(parseInt(d)));
          dvRanges.push(dvRange);
        });
        if (dvRanges.length != 5) {
          messages.push(new RouterMessage(`Something went wrong here, were all the dv's valid numbers?`, RouterMessage.Type.Error));
        } else {
          battler = new game.model.Battler1(game, pokemon, null, false, obj.properties.level, false, dvRanges);
        }
      }
    } else {
      messages.push(new RouterMessage(`Not supported in gen2+ yet!`, RouterMessage.Type.Error));
    }
    let entry = new RouteManip(game, battler, info, location);
    messages.forEach(m => entry.addMessage(m));
    return entry;
  }
}
