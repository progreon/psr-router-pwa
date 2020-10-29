import { EntryJSON } from "./EntryJSON";
import { ScopedLine } from "./ScopedLine";
import { RouteMenu } from "../RouteMenu";

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
 * Menu: [<title> ::] <summary>
 *     <option> [:: <description>]
 *     [<option> [:: <description>]
 *      ..]
 * with <option> being one of the following:
 *     Use: <item> [<count:1> [<pokemon index:1> [<move index:1>]]]
 *     Swap: <index|item> <index|item>
 *     SwapP: <index> <index>
 *     Teach: <tm|hm> [<pokemon index:1> [<move index:1>]]
 *     Toss: <item> [<count:1>]
 *     [D:] <description>
 *
 * json:
 * {
 *     type,
 *     info: { title, summary, description },
 *     location, // TODO
 *     properties: {
 *         actions: { type, description, item1, item2, index1, index2, count }[]
 *     }
 * }
 */
export class RouteMenuParser extends ARouteActionsParser {
    public get parsers(): { [key: string]: IActionParser; } {
        return parsers;
    }
    public get defaultParser() {
        return parsers[DirectionAction.ACTION_TYPE.toUpperCase()];
    }

    public linesToJSON(scopedLine: ScopedLine, filename: string): EntryJSON {
        let entry = super.linesToJSON(scopedLine, filename);
        if (scopedLine.untypedLine) {
            let titleLine = scopedLine.untypedLine;
            let [tOrS, ...s] = titleLine.split("::");
            let summ = s && s.length > 0 ? s.join("::").trim() : "";
            entry.info = { title: summ ? tOrS.trim() : "", summary: summ || tOrS, description: "" };
        }
        return entry;
    }

    public jsonToLines(jsonEntry: EntryJSON): ScopedLine {
        // TODO: test
        let scopedLine = super.jsonToLines(jsonEntry);
        scopedLine.line = RouteMenu.ENTRY_TYPE + ":";
        if (jsonEntry.info.summary) {
            scopedLine.line += ` ${jsonEntry.info.summary}`;
        }
        return scopedLine;
    }
}
