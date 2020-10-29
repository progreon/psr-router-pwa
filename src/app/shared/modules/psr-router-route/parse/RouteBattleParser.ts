import { EntryJSON } from "./EntryJSON";
import { ActionJSON } from "./actions/ActionJSON";
import { ScopedLine } from "./ScopedLine";
import * as Util from '../../psr-router-util';
import { RouteBattle } from "../RouteBattle";

import { UseAction } from "../psr-router-route-actions/UseAction";
import { SwapAction } from "../psr-router-route-actions/SwapAction";
import { SwapPokemonAction } from "../psr-router-route-actions/SwapPokemonAction";
import { DirectionAction } from "../psr-router-route-actions/DirectionAction";
import { BSettingsAction } from "../psr-router-route-actions/BSettingsAction";
import { OpponentAction } from "../psr-router-route-actions/OpponentAction";

import { ARouteActionsParser } from "./ARouteActionsParser";

import { IActionParser } from "./actions/IActionParser";
import { UseActionParser } from "./actions/UseActionParser";
import { SwapActionParser } from "./actions/SwapActionParser";
import { SwapPokemonActionParser } from "./actions/SwapPokemonActionParser";
import { DirectionActionParser } from "./actions/DirectionActionParser";
import { BSettingsActionParser } from "./actions/BSettingsActionParser";
import { OpponentActionParser } from "./actions/OpponentActionParser";

const parsers: { [key: string]: IActionParser } = {};
parsers[UseAction.ACTION_TYPE.toUpperCase()] = new UseActionParser();
parsers[SwapAction.ACTION_TYPE.toUpperCase()] = new SwapActionParser();
parsers[SwapPokemonAction.ACTION_TYPE.toUpperCase()] = new SwapPokemonActionParser();
parsers[DirectionAction.ACTION_TYPE.toUpperCase()] = new DirectionActionParser();
parsers[BSettingsAction.ACTION_TYPE.toUpperCase()] = new BSettingsActionParser();
parsers[OpponentAction.ACTION_TYPE.toUpperCase()] = new OpponentActionParser();

/**
 * lines:
 * B: <trainer> [[:: <title>] :: <summary>]
 *     <action>
 *     [<action>
 *     [..]]
 *
 * json:
 * {
 *     type,
 *     info: { title, summary, description },
 *     location, // TODO
 *     properties: {
 *         trainer,
 *         actions
 *     }
 * }
 */
export class RouteBattleParser extends ARouteActionsParser {
    public static readonly PARSERS = parsers;
    public static readonly DEFAULT_PARSER = parsers[DirectionAction.ACTION_TYPE.toUpperCase()];
    public get parsers(): { [key: string]: IActionParser; } {
        return parsers;
    }
    public get defaultParser() {
        return parsers[DirectionAction.ACTION_TYPE.toUpperCase()];
    }

    public linesToJSON(scopedLine: ScopedLine, filename: string): EntryJSON {
        let entry = super.linesToJSON(scopedLine, filename);
        let [trainer, title, ...summ] = scopedLine.untypedLine.split("::");
        if (!trainer) {
            throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Please provide a trainer id`, "Parser Error");
        }
        title = title ? title.trim() : "";
        entry.properties.trainer = trainer.trim();
        let summary = summ.length > 0 ? summ.join("::").trim() : title;
        entry.info = { title: summ.length > 0 ? title : "", summary: summary, description: "" };

        return entry;
    }

    public jsonToLines(jsonEntry: EntryJSON): ScopedLine {
        // TODO: test
        let scopedLine = super.jsonToLines(jsonEntry);
        let line = `${RouteBattle.ENTRY_TYPE}: ${jsonEntry.properties.trainer}`;
        if (jsonEntry.info.title) {
            line = `${line} :: ${jsonEntry.info.title}`;
        }
        if (jsonEntry.info.summary) {
            line = `${line} :: ${jsonEntry.info.summary}`;
        }
        scopedLine.line = line;
        return scopedLine;
    }
}