import { EntryJSON } from "./EntryJSON";

export class RouteJSON extends EntryJSON {
    public v = 1;
    constructor(
        public game: string,
        public shortname: string,
        info: { title?: string, summary?: string, description?: string },
        entries: EntryJSON[]
    ) {
        super("Route", info, null, entries, null);
    }
}