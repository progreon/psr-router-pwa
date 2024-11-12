import { RouteEntry } from "./RouteEntry";

export abstract class RouteEntryParser<E extends RouteEntry> {
    public abstract linesToJSON(lines: string[]): any;
    public abstract jsonToLines(json: any): string[];
    public abstract jsonToEntry(json: any): E;
    public abstract entryToJson(entry: E): any;
    public linesToEntry(lines: string[]): E {
        return this.jsonToEntry(this.linesToJSON(lines));
    }
    public entryToLines(entry: E): string[] {
        return this.jsonToLines(this.entryToJson(entry));
    }
}