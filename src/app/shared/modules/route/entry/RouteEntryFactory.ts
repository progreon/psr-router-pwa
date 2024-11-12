import { RouteEntry } from "./RouteEntry";
import { RouteEntryCWC } from "./RouteEntryCWC";
import { RouteEntryParser } from "./RouteEntryParser";

/**
 * ???
 */
export class RouteEntryFactory<E extends RouteEntry, P extends RouteEntryParser<E>, C extends RouteEntryCWC<E>> {
    private _parser: P;
    public get parser(): P {
        if (!this._parser) {
            throw new Error(`No parser set for this factory: ${typeof this}`);
        }
        return this._parser;
    }
}