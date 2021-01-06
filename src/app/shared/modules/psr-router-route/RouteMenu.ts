'use strict';

// imports
import { RouterMessage } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import * as Model from 'SharedModules/psr-router-model/Model';
import { EntryJSON } from './parse/EntryJSON';
import { ActionJSON } from './parse/actions/ActionJSON';

import { ARouteActionsEntry } from './ARouteActionsEntry';

import { AAction } from './psr-router-route-actions/AAction';
import { UseAction } from './psr-router-route-actions/UseAction';
import { SwapAction } from './psr-router-route-actions/SwapAction';
import { SwapPokemonAction } from './psr-router-route-actions/SwapPokemonAction';
import { TmAction } from './psr-router-route-actions/TmAction';
import { TossAction } from './psr-router-route-actions/TossAction';
import { DirectionAction } from './psr-router-route-actions/DirectionAction';
import { BSettingsAction } from './psr-router-route-actions/BSettingsAction';

const possibleActions: { [key: string]: (obj: ActionJSON, game: Model.Game) => AAction } = {};
possibleActions[UseAction.ACTION_TYPE.toUpperCase()] = UseAction.newFromJSONObject;
possibleActions[SwapAction.ACTION_TYPE.toUpperCase()] = SwapAction.newFromJSONObject;
possibleActions[SwapPokemonAction.ACTION_TYPE.toUpperCase()] = SwapPokemonAction.newFromJSONObject;
possibleActions[TmAction.ACTION_TYPE.toUpperCase()] = TmAction.newFromJSONObject;
possibleActions[TossAction.ACTION_TYPE.toUpperCase()] = TossAction.newFromJSONObject;
possibleActions[DirectionAction.ACTION_TYPE.toUpperCase()] = DirectionAction.newFromJSONObject;
possibleActions[BSettingsAction.ACTION_TYPE.toUpperCase()] = BSettingsAction.newFromJSONObject;
const defaultAction: (obj: ActionJSON, game: Model.Game) => AAction = possibleActions[DirectionAction.ACTION_TYPE.toUpperCase()];

/**
 * A class representing a route-entry that does a menu sequence.
 * @todo WildEncounters
 * @todo parent?
 * @todo writeToString
 */
export class RouteMenu extends ARouteActionsEntry {
  public static readonly ENTRY_TYPE: string = "Menu";

  /**
   *
   * @param game        The Game object this route entry uses.
   * @param actions     The menu actions that happen.
   * @param info        The info for this entry.
   * @param location    The location in the game where this entry occurs.
   */
  constructor(game: Model.Game, info: RouteEntryInfo = null, location: Model.Location = null) {
    super(game, info, location);
  }

  public get entryType(): string {
    return RouteMenu.ENTRY_TYPE;
  }

  apply(player?: Model.Player, fireApplied = true): void {
    super.apply(player, false);
    let nextPlayer = super.nextPlayer;

    this.actions.forEach(action => {
      action.applyAction(nextPlayer);
      action.messages.forEach(m => this.addMessage(m));
    });

    super.updateNextPlayer(nextPlayer, fireApplied);
  }

  getJSONObject(): EntryJSON {
    return super.getJSONObject();
  }

  static newFromJSONObject(obj: EntryJSON, game: Model.Game): RouteMenu {
    let messages: RouterMessage[] = [];
    let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
    let location = undefined; // TODO, parse from obj.location

    let entry = new RouteMenu(game, info, location);
    entry.setActionsFromJSONObject(obj, possibleActions, defaultAction, game);
    messages.forEach(m => entry.addMessage(m));
    return entry;
  }
}
