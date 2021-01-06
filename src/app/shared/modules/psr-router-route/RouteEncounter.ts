'use strict';

// imports
import { RouterMessage } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { Game } from '../psr-router-model/Game';
import { Location, Player } from '../psr-router-model/Model';
import { Battler, Pokemon } from '../psr-router-model/ModelAbstract';
import { EntryJSON } from './parse/EntryJSON';
import { ActionJSON } from './parse/actions/ActionJSON';

import { RouteBattle } from './RouteBattle';

import { AAction } from './psr-router-route-actions/AAction';
import { UseAction } from './psr-router-route-actions/UseAction';
import { SwapAction } from './psr-router-route-actions/SwapAction';
import { SwapMoveAction } from './psr-router-route-actions/SwapMoveAction';
import { SwapPokemonAction } from './psr-router-route-actions/SwapPokemonAction';
import { DirectionAction } from './psr-router-route-actions/DirectionAction';
import { BSettingsAction } from './psr-router-route-actions/BSettingsAction';

const possibleActions: { [key: string]: (obj: ActionJSON, game: Game) => AAction } = {};
possibleActions[UseAction.ACTION_TYPE.toUpperCase()] = UseAction.newFromJSONObject;
possibleActions[SwapAction.ACTION_TYPE.toUpperCase()] = SwapAction.newFromJSONObject;
possibleActions[SwapMoveAction.ACTION_TYPE.toUpperCase()] = SwapMoveAction.newFromJSONObject;
possibleActions[SwapPokemonAction.ACTION_TYPE.toUpperCase()] = SwapPokemonAction.newFromJSONObject;
possibleActions[DirectionAction.ACTION_TYPE.toUpperCase()] = DirectionAction.newFromJSONObject;
possibleActions[BSettingsAction.ACTION_TYPE.toUpperCase()] = BSettingsAction.newFromJSONObject;
const defaultAction: (obj: ActionJSON, game: Game) => AAction = possibleActions[DirectionAction.ACTION_TYPE.toUpperCase()];

/**
 * A class representing a route-entry that handles battles.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 */
export class RouteEncounter extends RouteBattle {
  public static readonly POSSIBLE_ACTIONS = possibleActions;
  public static readonly DEFAULT_ACTION = defaultAction;

  public static readonly ENTRY_TYPE: string = "E";
  public readonly encounter: Battler;

  /**
   *
   * @param {Game}            game              The Game object this route entry uses.
   * @param {Trainer}         trainer           The trainer to battle against.
   * @param {RouteEntryInfo}  [info]            The info for this entry.
   * @param {Location}        [location]        The location in the game where this entry occurs.
   */
  constructor(game: Game, encounter: Battler, info: RouteEntryInfo = null, location: Location = null) {
    super(game, null, info, location);
    this.encounter = encounter;
  }

  public get entryType(): string {
    return RouteEncounter.ENTRY_TYPE;
  }

  public get opponentParty(): Battler[] {
    return [this.encounter];
  }

  getJSONObject(): EntryJSON {
    let obj: EntryJSON = super.getJSONObject();
    obj.properties.encounter = { pokemon: this.encounter.pokemon.key, level: this.encounter.level };
    return obj;
  }

  static newFromJSONObject(obj: EntryJSON, game: Game): RouteBattle {
    let messages: RouterMessage[] = [];
    let pokemon: Pokemon = game.findPokemonByName(obj.properties.encounter.pokemon);
    if (!pokemon) {
      pokemon = game.getDummyPokemon(obj.properties.encounter.pokemon);
      if (!game.info.unsupported) {
        messages.push(new RouterMessage(`Pokemon "${obj.properties.encounter.pokemon}" not found!`, RouterMessage.Type.Error));
      }
    }
    let level: number = obj.properties.encounter.level;
    let location = undefined; // TODO, parse from obj.location
    let encounter = game.createBattler(pokemon, level, location);
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);

    let entry = new RouteEncounter(game, encounter, info, location);
    entry.setActionsFromJSONObject(obj, possibleActions, defaultAction, game);
    messages.forEach(m => entry.addMessage(m));
    return entry;
  }
}
