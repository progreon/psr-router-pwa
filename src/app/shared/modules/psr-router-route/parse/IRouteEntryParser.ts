import { ScopedLine } from "./ScopedLine";
import { EntryJSON } from "./EntryJSON";

export interface IRouteEntryParser {
    linesToJSON(scopedLine: ScopedLine, filename: string): EntryJSON;
    jsonToLines(jsonEntry: EntryJSON): ScopedLine;
}