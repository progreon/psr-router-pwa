'use strict';

// imports
import { RouterMessage } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { RouteEntry } from '.';
import * as Model from 'SharedModules/psr-router-model/Model';
import * as ModelAbstract from 'SharedModules/psr-router-model/ModelAbstract';
import { EntryJSON } from './parse/EntryJSON';

/**
 * A class representing a route-entry that gets you a pokemon out of a list of possible pokemon.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 */
export class RouteGetPokemon extends RouteEntry {
  public static readonly ENTRY_TYPE: string = "GetP";
  private _choices: ModelAbstract.Battler[];
  public get choices() { return this._choices; }
  private _preference: number;
  public get preference() { return this._preference; }
  private _currentChoice: number;
  public get currentChoice() { return this._currentChoice; }
  public set currentChoice(value: number) { this._currentChoice = value; super._firePropertiesChanged(); }

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
    this._currentChoice = this._preference;
  }

  public get entryType(): string {
    return RouteGetPokemon.ENTRY_TYPE;
  }

  apply(player?: Model.Player, fireApplied = true): void {
    super.apply(player, false);
    let nextPlayer = super.playerAfter;

    let choice: ModelAbstract.Battler;
    if (this.choices.length > 0) {
      if (this.choices.length > this._currentChoice) {
        choice = this.choices[this._currentChoice];
      } else {
        this.addMessage(new RouterMessage("Preferred option not available (out of bounds): ignoring", RouterMessage.Type.Warning));
      }
    } else {
      this.addMessage(new RouterMessage("You didn't specify any options: ignoring", RouterMessage.Type.Warning));
    }
    if (choice) {
      nextPlayer.addBattler(choice);
    }

    super.updateNextPlayer(nextPlayer, fireApplied);
  }

  toString(): string {
    let str = this.info.toString();
    if (!str?.trim()) {
      if (this.choices.length > 1) {
        str = `Get one of: ${this.choices.map(pl => pl.toString()).join(", ")}`;
      } else if (this.choices.length == 1) {
        str = `Get ${this.choices[0]}`;
      } else {
        str = `Get a pokemon, but which one?`;
      }
    }
    return str;
  }

  getJSONObject(): EntryJSON {
    let obj = super.getJSONObject();
    obj.properties.choices = [];
    this._choices.forEach(pl => obj.properties.choices.push({ pokemon: pl.pokemon.name, level: pl.level }));
    obj.properties.preference = this._preference;
    return obj;
  }

  static newFromJSONObject(obj: EntryJSON, game: Model.Game): RouteGetPokemon {
    let messages: RouterMessage[] = [];
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let location = undefined; // TODO, parse from obj.location
    let choices: ModelAbstract.Battler[] = [];
    obj.properties.choices.forEach((pl: { pokemon: string; level: number; }) => {
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
    let entry = new RouteGetPokemon(game, choices, obj.properties.preference, info, location);
    messages.forEach(m => entry.addMessage(m));
    return entry;
  }
}
