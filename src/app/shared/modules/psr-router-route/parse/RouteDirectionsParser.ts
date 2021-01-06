import { EntryJSON } from "./EntryJSON";
import { IRouteEntryParser } from "./IRouteEntryParser";
import { ScopedLine } from "./ScopedLine";

/**
 * lines:
 * <summary>
 *     [<description lines>
 *      ..]
 *
 * json:
 * {
 *     type,
 *     info: { title, summary, description },
 *     location, // TODO
 * }
 */
export class RouteDirectionsParser implements IRouteEntryParser {
    public linesToJSON(scopedLine: ScopedLine, filename: string): EntryJSON {
        let entry = new EntryJSON(scopedLine.type);
        entry.info.summary = scopedLine.line;
        entry.info.description = scopedLine.scope ? scopedLine.scope.map(l => l.line).join("\n") : "";
        return entry;
    }
    public jsonToLines(jsonEntry: EntryJSON): ScopedLine {
        let scopedLine = new ScopedLine();
        if (jsonEntry.info) {
            if (jsonEntry.info.summary) {
                scopedLine.line = jsonEntry.info.summary
                if (jsonEntry.info.description)
                    jsonEntry.info.description.split("\n").forEach(d => scopedLine.scope.push(new ScopedLine(d.trim())));
            } else {
                // TODO
            }
        }
        return scopedLine;
    }
}