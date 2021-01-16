import { EntryJSON } from "./EntryJSON";
import { IRouteEntryParser } from "./IRouteEntryParser";
import { ScopedLine } from "./ScopedLine";
import * as Util from '../../psr-router-util';
import { RouteGetItem } from "../RouteGetItem";

/**
 * lines:
 * GetI: <item> [<traded for>] [[:: <title>] :: <summary>]
 *     [<description lines>]
 * with <option> = <pokemon>:<level>
 * only one preferred option (with '#') allowed
 *
 * json:
 * {
 *     type,
 *     info: { title, summary, description },
 *     location, // TODO
 *     properties: {
 *         item,
 *         tradedFor
 *     }
 * }
 */
export class RouteGetItemParser implements IRouteEntryParser {
    public linesToJSON(scopedLine: ScopedLine, filename: string): EntryJSON {
        let entry = new EntryJSON(scopedLine.type);
        let [items, title, ...summ] = scopedLine.untypedLine.split("::");
        if (!items) {
            throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Please provide an item`, "Parser Error");
        }
        title = title ? title.trim() : "";
        let [item, tradedFor] = items.trim().split(" ");
        entry.properties.item = item.trim();
        entry.properties.tradedFor = tradedFor?.trim();
        let summary = summ.length > 0 ? summ.join("::").trim() : title;
        entry.info = { title: summ.length > 0 ? title : "", summary: summary, description: "" };
        entry.info.description = scopedLine.scope.map(l => l.line).join("\n");

        return entry;
    }
    public jsonToLines(jsonEntry: EntryJSON): ScopedLine {
        let scopedLine = new ScopedLine(`${RouteGetItem.ENTRY_TYPE}: ${jsonEntry.properties.item}`);
        if (jsonEntry.properties.tradedFor) {
            scopedLine.line = `${scopedLine.line} ${jsonEntry.properties.tradedFor}`;
        }
        if (jsonEntry.info.title) {
            scopedLine.line = `${scopedLine.line} :: ${jsonEntry.info.title}`;
        }
        if (jsonEntry.info.summary) {
            scopedLine.line = `${scopedLine.line} :: ${jsonEntry.info.summary}`;
        }
        return scopedLine;
    }
}
