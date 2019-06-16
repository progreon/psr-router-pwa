import { EntryJSON } from "./EntryJSON";
import { IRouteEntryParser } from "./IRouteEntryParser";
import { ScopedLine } from "./ScopedLine";
import * as Util from '../../psr-router-util';
import { RouteSwapPokemon } from "../RouteSwapPokemon";

/**
 * lines:
 * Swap: <index1> <index2>
 *     [<title> ::] <summary>
 *     <description lines>
 *
 * json:
 * {
 *     type,
 *     info: { title, summary, description },
 *     location, // TODO
 *     swaps: { index1, index2 }
 * }
 */
export class RouteSwapPokemonParser implements IRouteEntryParser {
    public linesToJSON(scopedLine: ScopedLine, filename: string): EntryJSON {
        let entry = new EntryJSON(scopedLine.type);
        let indices = scopedLine.untypedLine.split(" ");
        if (indices.length != 2 || +indices[0] < 0 || +indices[1] < 0) {
            throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Swap expects 2 positive indices`, "Parser Error");
        }
        entry.properties.swaps = { index1: indices[0], index2: indices[1] };
        if (scopedLine.scope && scopedLine.scope.length > 0) {
            let titleLine = scopedLine.scope.shift();
            let [tOrS, ...s] = titleLine.line.split("::");
            let summ = s && s.length > 0 ? s.join("::").trim() : "";
            entry.info = { title: summ ? tOrS.trim() : "", summary: summ || tOrS, description: "" };
            entry.info.description = scopedLine.scope.map(l => l.line).join("\n");
        }
        return entry;
    }
    public jsonToLines(jsonEntry: EntryJSON): ScopedLine {
        let scopedLine = new ScopedLine(RouteSwapPokemon.ENTRY_TYPE + ":");
        scopedLine.line += ` ${jsonEntry.properties.swaps.index1} ${jsonEntry.properties.swaps.index2}`;
        if (jsonEntry.info) {
            if (jsonEntry.info.summary) {
                scopedLine.scope.push(new ScopedLine((jsonEntry.info.title ? jsonEntry.info.title + " :: " : "") + jsonEntry.info.summary));
                if (jsonEntry.info.description) {
                    jsonEntry.info.description.split("\n").forEach(d => scopedLine.scope.push(new ScopedLine(d.trim())));
                }
            } else {
                // TODO
            }
        }
        return scopedLine;
    }
}