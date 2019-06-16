import { EntryJSON } from "./EntryJSON";
import { IRouteEntryParser } from "./IRouteEntryParser";
import { ScopedLine } from "./ScopedLine";
import { RouteEntry } from "../RouteEntry";

/**
 * lines:
 * ENTRY: <title> [:: <summary>]
 *     <description lines>
 *
 * json:
 * {
 *     type,
 *     info: { title, summary, description },
 *     location, // TODO
 *     entryString // TEMP
 * }
 */
export class RouteEntryParser implements IRouteEntryParser {
    public linesToJSON(scopedLine: ScopedLine, filename: string): EntryJSON {
        let entry = new EntryJSON(scopedLine.type);
        entry.properties.entryString = scopedLine.untypedLine; // TODO: this is only temporary until route entries are more complete
        let [title, ...summary] = scopedLine.untypedLine.split("::");
        entry.info = { title: title.trim(), summary: summary.join("::").trim(), description: "" };
        entry.info.description = scopedLine.scope ? scopedLine.scope.map(l => l.line).join("\n") : "";
        return entry;
    }
    public jsonToLines(jsonEntry: EntryJSON): ScopedLine {
        let scopedLine = new ScopedLine();
        if (jsonEntry.info) {
            if (jsonEntry.info.title) {
                scopedLine.line = RouteEntry.ENTRY_TYPE + ": " + jsonEntry.info.title + (jsonEntry.info.summary ? " :: " + jsonEntry.info.summary : "");
                if (jsonEntry.info.description)
                    jsonEntry.info.description.split("\n").forEach(d => scopedLine.scope.push(new ScopedLine(d.trim())));
            } else {
                // TODO
            }
        }
        return scopedLine;
    }
}