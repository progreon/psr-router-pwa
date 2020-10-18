import { RouteEntry } from "./RouteEntry";

// TODO: have RouteMenu and RouteBattle implement this

// imports
import { RouterMessage } from '../psr-router-util';
import { RouteEntryInfo } from './util';
import { Game } from '../psr-router-model/Game';
import { Location, Player } from '../psr-router-model/Model';
import { EntryJSON } from './parse/EntryJSON';
import { OpponentAction } from "./psr-router-route-actions/OpponentAction";
import { AAction } from "./psr-router-route-actions/AAction";

export abstract class ARouteActionsEntry extends RouteEntry {
    /**
     *
     * @param game      The Game object this route entry uses.
     * @param info      The info for this entry.
     * @param location  The location in the game where this entry occurs.
     */
    constructor(game: Game, info: RouteEntryInfo = null, location: Location = null) {
        super(game, info, location);
    }

    public get entryType(): string {
        return undefined;
    }

    getJSONObject(): EntryJSON {
        return super.getJSONObject();
    }

    static newFromJSONObject(obj: EntryJSON, game: Game): ARouteActionsEntry {
        let info = new RouteEntryInfo(obj.info.title, obj.info.summary, obj.info.description);
        let location: Location = null; // TODO, parse from obj.location
        // TODO
        // return new RouteDirections(game, info, location);
        return undefined;
    }
}
