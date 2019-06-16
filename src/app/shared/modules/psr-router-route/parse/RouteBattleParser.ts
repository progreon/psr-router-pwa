import { EntryJSON } from "./EntryJSON";
import { IRouteEntryParser } from "./IRouteEntryParser";
import { ScopedLine } from "./ScopedLine";
import * as Util from '../../psr-router-util';
import { RouteBattle } from "../RouteBattle";

/**
 * lines:
 * B: <trainer> [:: <shared> [<shared> [..]]]
 *     [<title> ::] <summary>
 *     <description lines>
 * with <shared> = <trainerPartyId>:<playerPartyId>[,<playerPartyId>[..]]
 *
 * json:
 * {
 *     type,
 *     info: { title, summary, description },
 *     location, // TODO
 *     trainer
 *     shareExp
 * }
 */
export class RouteBattleParser implements IRouteEntryParser {
    public linesToJSON(scopedLine: ScopedLine, filename: string): EntryJSON {
        let entry = new EntryJSON(scopedLine.type);
        let [trainer, shared] = scopedLine.untypedLine.split("::").map(s => s.trim());
        if (!trainer) {
            throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Please provide a trainer id`, "Parser Error");
        }
        entry.properties.trainer = trainer;
        if (shared) {
            // eg: "0:0,1  2:1"
            let bs = shared.split(" ").filter(spl => !!spl); // filter out the empty strings (in case of multiple spaces)
            let se: { [key: number]: number[]; } = {};
            let seMax = 0;
            bs.forEach(ops => {
                let [_o, _ps] = ops.split(":");
                if (_o && _ps) {
                    let o = parseInt(_o);
                    if (isNaN(o)) {
                        throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Invalid share-parameter ${ops} (o${o})`, "Parser Error");
                    }
                    se[o] = _ps.split(",").map(function (_p) {
                        let p = parseInt(_p);
                        if (isNaN(p)) {
                            throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Invalid share-parameter ${ops}`, "Parser Error");
                        }
                        return p;
                    });
                    seMax = Math.max(o, seMax);
                }
                else {
                    throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Invalid share-parameter ${ops}`, "Parser Error");
                }
            });
            entry.properties.shareExp = [];
            for (let i = 0; i <= seMax; i++) {
                entry.properties.shareExp.push(se[i] ? se[i] : [0]);
            }
        }
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
        // eg: "0:0,1 1:0 2:1"
        let scopedLine = new ScopedLine(RouteBattle.ENTRY_TYPE + ": " + jsonEntry.properties.trainer);
        if (jsonEntry.properties.shareExp) {
            scopedLine.line += " ::";
            for (let i = 0; i < jsonEntry.properties.shareExp.length; i++) {
                scopedLine.line += ` ${i}:${jsonEntry.properties.shareExp[i].join(",")}`;
            }
        }
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