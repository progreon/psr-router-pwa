import { RouteEntry } from "./RouteEntry";

// TODO: have RouteMenu and RouteBattle implement this

// imports
import { RouteEntryInfo } from './util';
import { Game } from '../psr-router-model/Game';
import { Location } from '../psr-router-model/Model';
import { EntryJSON } from './parse/EntryJSON';
import { AAction } from "./psr-router-route-actions/AAction";
import { ActionJSON } from "./parse/actions/ActionJSON";

export abstract class ARouteActionsEntry extends RouteEntry {
    private _actions: AAction[] = [];
    /**
     *
     * @param game      The Game object this route entry uses.
     * @param info      The info for this entry.
     * @param location  The location in the game where this entry occurs.
     */
    constructor(game: Game, info: RouteEntryInfo = null, location: Location = null) {
        super(game, info, location);
    }

    public abstract get entryType(): string;

    public getJSONObject(): EntryJSON {
        let obj = super.getJSONObject();

        let actions = [];
        this._actions.forEach(action => {
            actions.push(action.getJSONObject());
        });
        obj.properties.actions = actions;

        return obj;
    }

    public setActionsFromJSONObject(
        obj: EntryJSON,
        possibleActions: { [key: string]: (obj: ActionJSON, game: Game) => AAction },
        game: Game
    ) {
        this._actions = [];
        obj.properties.actions.forEach(action => {
            if (possibleActions[action.type.toUpperCase()]) {
                // Just a check for extra safety
                this._actions.push(possibleActions[action.type.toUpperCase()](action, game))
            }
        });
    }
}
