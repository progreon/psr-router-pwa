'use strict';

// imports
import { RouterMessage } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteEntry } from '.';
import * as Model from 'SharedModules/psr-router-model/Model';
import * as ModelAbstract from 'SharedModules/psr-router-model/ModelAbstract';
// import * as Model1 from 'SharedModules/psr-router-model/Model1';

/**
 * A class representing a route-entry that gets you a pokemon out of a list of possible pokemon.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 */
export class RouteGetPokemon extends RouteEntry {
  public static readonly ENTRY_TYPE: string = "GetP";
  private _choices: ModelAbstract.Battler[];
  private _preference: number;
  public get choices() { return this._choices; }
  /**
   *
   * @param game        The Game object this route entry uses.
   * @param choices     The different battlers to choose from.
   * @param preference  The preferred choise.
   * @param info        The info for this entry.
   * @param location    The location in the game where this entry occurs.
   */
  constructor(game: Model.Game, choices: ModelAbstract.Battler[], preference: number = 0, info: RouteEntryInfo = null, location: Model.Location = null) {
    super(game, info, location);
    this._choices = choices;
    this._preference = preference;
  }

  public get entryType(): string {
    return RouteGetPokemon.ENTRY_TYPE;
  }

  apply(player?: Model.Player): Model.Player {
    player = super.apply(player);

    let choice: ModelAbstract.Battler;
    if (this.choices.length > 0) {
      if (this.choices.length > this._preference) {
        choice = this.choices[this._preference];
      } else {
        this.addMessage(new RouterMessage("Preferred option not available (out of bounds): ignoring", RouterMessage.Type.Warning));
      }
    } else {
      this.addMessage(new RouterMessage("You didn't specify any options: ignoring", RouterMessage.Type.Warning));
    }
    if (choice) {
      player.addBattler(choice);
    }

    super._playerAfter = player;
    return player;
  }

  getJSONObject(): any {
    let obj = super.getJSONObject();
    obj.choices = [];
    this._choices.forEach(pl => obj.choices.push({ pokemon: pl.pokemon.name, level: pl.level }));
    obj.preference = this._preference;
    return obj;
  }

  static newFromJSONObject(game: Model.Game, obj: any): RouteGetPokemon {
    let messages: RouterMessage[] = [];
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let location = undefined; // TODO, parse from obj.location
    let choices: ModelAbstract.Battler[] = [];
    obj.choices.forEach((pl: { pokemon: string; level: number; }) => {
      let pokemon = game.findPokemonByName(pl.pokemon);
      if (!pokemon) {
        pokemon = game.getDummyPokemon(pl.pokemon);
        if (!game.info.unsupported) {
          messages.push(new RouterMessage(`Pokemon "${pl.pokemon}" not found!`, RouterMessage.Type.Error));
        }
      }
      if (game.info.gen == 1) {
        choices.push(new game.model.Battler1(game, pokemon, location, false, pl.level));
      } else {
        messages.push(new RouterMessage(`Not supported in gen2+ yet!`, RouterMessage.Type.Error));
      }
    });
    let entry = new RouteGetPokemon(game, choices, obj.preference, info, location);
    messages.forEach(m => entry.addMessage(m));
    return entry;
  }
}
