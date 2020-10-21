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
    public get parsers(): { [key: string]: IActionParser; } {
        return parsers;
    }

    public linesToJSON(scopedLine: ScopedLine, filename: string): EntryJSON {
        let entry = super.linesToJSON(scopedLine, filename);
        let [trainer, title, ...summ] = scopedLine.untypedLine.split("::");
        if (!trainer) {
            throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Please provide a trainer id`, "Parser Error");
        }
        entry.properties.trainer = trainer;
        let summary = summ ? summ.join("::").trim() : title;
        entry.info = { title: summ ? title : "", summary: summary, description: "" };

        let actions: ActionJSON[] = [];
        scopedLine.scope.forEach(sl => {
            let parser = this.parsers[sl.type.toUpperCase()];
            if (parser) {
                actions.push(parser.linesToJSON(sl, filename));
            } else {
                // TODO: throw exception?
                console.warn("Unknown action for type", sl.type);
            }
        });
        entry.properties.actions = actions;
        return entry;
    }

    public jsonToLines(jsonEntry: EntryJSON): ScopedLine {
        let line = `${RouteBattle.ENTRY_TYPE}: ${jsonEntry.properties.trainer}`;
        if (jsonEntry.info.title) {
            line = `${line} :: ${jsonEntry.info.title}`;
        }
        if (jsonEntry.info.summary) {
            line = `${line} :: ${jsonEntry.info.summary}`;
        }
        let scopedLine = new ScopedLine(line);

        let actions: ActionJSON[] = jsonEntry.properties.actions;
        actions.forEach(action => {
            let parser = RouteBattleParser.PARSERS[action.type.toUpperCase()];
            if (parser) {
                scopedLine.scope.push(parser.jsonToLines(action));
            } else {
                // TODO: throw exception?
                console.warn("Unknown action for type", action.type);
            }
        });

        return scopedLine;
    }
}