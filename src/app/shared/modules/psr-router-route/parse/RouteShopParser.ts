import { EntryJSON } from "./EntryJSON";
import { IRouteEntryParser } from "./IRouteEntryParser";
import { ScopedLine } from "./ScopedLine";
import * as Util from '../../psr-router-util';
import { RouteShop } from "../RouteShop";

/**
 * lines:
 * Shop: [<title> ::] <summary>
 *     <shop entry>
 * with <shop entry> being one of:
 *     <n> <item to buy n of> [:: description]
 *     -<n> <item to sell n of> [:: description]
 *     * <item to sell all of> [:: description]
 *
 * json:
 * {
 *     type,
 *     info: { title, summary, description },
 *     location, // TODO
 *     properties: {
 *         entries: { item, count, description }[]
 *     }
 * }
 */
export class RouteShopParser implements IRouteEntryParser {
    public linesToJSON(scopedLine: ScopedLine, filename: string): EntryJSON {
        let entry = new EntryJSON(scopedLine.type);
        let [title, ...summ] = scopedLine.untypedLine.split("::");
        title = title ? title.trim() : "";
        let summary = summ.length > 0 ? summ.join("::").trim() : title;
        entry.info = { title: summ.length > 0 ? title : "", summary: summary, description: "" };

        let entries: { item: string, count: string, description?: string }[] = [];
        scopedLine.scope.forEach(l => {
            let [ci, description] = l.line.split("::").map(s => s.trim());
            let [count, item] = ci.split(" ").filter(s => !!s);
            if (!((+count && +count != 0) || count == "*")) {
                throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Invalid count "${count}" for ${item}, count needs to be positive, negative or '*'`, "Parser Error");
            }
            let entry: { item: string, count: string, description?: string } = { item, count };
            if (description) {
                entry.description = description;
            }
            entries.push(entry);
        });
        entry.properties.entries = entries;

        return entry;
    }
    public jsonToLines(jsonEntry: EntryJSON): ScopedLine {
        let scopedLine = new ScopedLine(`${RouteShop.ENTRY_TYPE}:`);
        if (jsonEntry.info.title) {
            scopedLine.line = `${scopedLine.line} :: ${jsonEntry.info.title}`;
        }
        if (jsonEntry.info.summary) {
            scopedLine.line = `${scopedLine.line} :: ${jsonEntry.info.summary}`;
        }
        jsonEntry.properties.entries.forEach((e: { item: string, count: string, description?: string }) => {
            let estr = `${e.count} ${e.item}`;
            if (e.description) {
                estr = `${estr} :: ${e.description}`;
            }
            scopedLine.scope.push(new ScopedLine(estr));
        });
        return scopedLine;
    }
}
