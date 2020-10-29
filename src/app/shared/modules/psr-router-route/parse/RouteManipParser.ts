import { EntryJSON } from "./EntryJSON";
import { IRouteEntryParser } from "./IRouteEntryParser";
import { ScopedLine } from "./ScopedLine";
import * as Util from '../../psr-router-util';
import { RouteManip } from "../RouteManip";

/**
 * lines:
 * Manip: <pokemon>:<level> <dvs>
 *     [<title> ::] <summary>
 *     <description lines>
 * with <dvs> being a space-separated list of dv's
 *
 * json:
 * {
 *     type,
 *     info: { title, summary, description },
 *     location, // TODO
 *     properties: {
 *         pokemon,
 *         level,
 *         dvs: dv-string[]
 *     }
 * }
 */
export class RouteManipParser implements IRouteEntryParser {
    public linesToJSON(scopedLine: ScopedLine, filename: string): EntryJSON {
        let entry = new EntryJSON(scopedLine.type);

        // set pokemon
        let [pl, ...dvs] = scopedLine.untypedLine.split(" ").filter(spl => spl !== '');
        let [pokemon, l] = pl.split(":");
        let level = parseInt(l);
        if (!pokemon || isNaN(level)) {
            throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Invalid pokemon-level pair "${pl}"`, "Parser Error");
        }
        entry.properties.pokemon = pokemon;
        entry.properties.level = level;

        // check dv-strings
        if (dvs.length == 0) {
            throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Please include the manipulated dv's`, "Parser Error");
        }
        dvs.forEach(dv => dv.split(',').forEach(d => { if (isNaN(parseInt(d))) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Please include valid dv numbers`, "Parser Error"); }));
        entry.properties.dvs = dvs;

        // set info
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
        let scopedLine = new ScopedLine(RouteManip.ENTRY_TYPE + ":");
        scopedLine.line += ` ${jsonEntry.properties.pokemon}:${jsonEntry.properties.level} ${jsonEntry.properties.dvs.join(' ')}`;

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
