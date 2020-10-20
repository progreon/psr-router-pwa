import { EntryJSON } from "./EntryJSON";
import { ScopedLine } from "./ScopedLine";
import * as Util from '../../psr-router-util';
import { RouteBattle } from "../RouteBattle";

import { UseAction } from "../psr-router-route-actions/UseAction";
import { SwapAction } from "../psr-router-route-actions/SwapAction";
import { SwapPokemonAction } from "../psr-router-route-actions/SwapPokemonAction";
import { TmAction } from "../psr-router-route-actions/TmAction";
import { TossAction } from "../psr-router-route-actions/TossAction";
import { DirectionAction } from "../psr-router-route-actions/DirectionAction";
import { BSettingsAction } from "../psr-router-route-actions/BSettingsAction";

import { ARouteActionsParser } from "./ARouteActionsParser";

import { IActionParser } from "./actions/IActionParser";
import { UseActionParser } from "./actions/UseActionParser";
import { SwapActionParser } from "./actions/SwapActionParser";
import { SwapPokemonActionParser } from "./actions/SwapPokemonActionParser";
import { TmActionParser } from "./actions/TmActionParser";
import { TossActionParser } from "./actions/TossActionParser";
import { DirectionActionParser } from "./actions/DirectionActionParser";
import { BSettingsActionParser } from "./actions/BSettingsActionParser";

const parsers: { [key: string]: IActionParser } = {};
parsers[UseAction.ACTION_TYPE.toUpperCase()] = new UseActionParser();
parsers[SwapAction.ACTION_TYPE.toUpperCase()] = new SwapActionParser();
parsers[SwapPokemonAction.ACTION_TYPE.toUpperCase()] = new SwapPokemonActionParser();
parsers[TmAction.ACTION_TYPE.toUpperCase()] = new TmActionParser();
parsers[TossAction.ACTION_TYPE.toUpperCase()] = new TossActionParser();
parsers[DirectionAction.ACTION_TYPE.toUpperCase()] = new DirectionActionParser();
parsers[BSettingsAction.ACTION_TYPE.toUpperCase()] = new BSettingsActionParser();

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
 *     properties: {
 *         trainer,
 *         shareExp
 *     }
 * }
 */
export class RouteBattleParser extends ARouteActionsParser {
    public static readonly PARSERS = parsers;
    public get parsers(): { [key: string]: IActionParser; } {
        return parsers;
    }

    public linesToJSON(scopedLine: ScopedLine, filename: string): EntryJSON {
        let entry = super.linesToJSON(scopedLine, filename);
        let [trainer, shared] = scopedLine.untypedLine.split("::").map(s => s.trim());
        if (!trainer) {
            throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Please provide a trainer id`, "Parser Error");
        }
        entry.properties.trainer = trainer;
        // TODO: move this to OpponentAction
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
        // TODO: move this to entry-line
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