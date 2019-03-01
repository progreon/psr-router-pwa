'use strict';

// imports
import { RouterMessage } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteEntry } from '.';
import * as Model from 'SharedModules/psr-router-model/Model';

/**
 * A class representing a route-entry that gets you a pokemon out of a list of possible pokemon.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 */
export class RouteGetPokemon extends RouteEntry {
  public static readonly ENTRY_TYPE: string = "GetP";
  private _choices: Model.PokemonLevelPair[];
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
  constructor(game: Model.Game, choices: Model.PokemonLevelPair[], preference: number = 0, info: RouteEntryInfo = null, location: Model.Location = null) {
    super(game, info, location);
    this._choices = choices;
    this._preference = preference;
  }

  public get entryType(): string {
    return RouteGetPokemon.ENTRY_TYPE;
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
    let choices = [];
    obj.choices.forEach((pl: { pokemon: string; level: number; }) => {
      let pokemon = game.findPokemonByName(pl.pokemon);
      if (!pokemon) {
        pokemon = game.getDummyPokemon(pl.pokemon);
        if (!game.info.unsupported) {
          messages.push(new RouterMessage(`Pokemon "${pl.pokemon}" not found!`, RouterMessage.Type.Error));
        }
      }
      choices.push(new Model.PokemonLevelPair(pokemon, pl.level))
    });
    let location = undefined; // TODO, parse from obj.location
    let entry = new RouteGetPokemon(game, choices, obj.preference, info, location);
    messages.forEach(m => entry.addMessage(m));
    return entry;
  }
}
