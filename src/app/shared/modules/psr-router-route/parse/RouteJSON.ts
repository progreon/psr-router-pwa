import { EntryJSON } from "./EntryJSON";

export class RouteJSON extends EntryJSON {
    constructor(
        public game: string,
        public shortname: string,
        info: { title?: string, summary?: string, description?: string },
        entries: EntryJSON[] = []
    ) {
        super("Route", info, null, entries, null);
    }
}