import { EntryJSON } from "./EntryJSON";
import { ActionJSON } from "./actions/ActionJSON";
import { ScopedLine } from "./ScopedLine";
import * as Util from '../../psr-router-util';
import { RouteEncounter } from "../RouteEncounter";

import { UseAction } from "../psr-router-route-actions/UseAction";
import { SwapAction } from "../psr-router-route-actions/SwapAction";
import { SwapMoveAction } from "../psr-router-route-actions/SwapMoveAction";
import { SwapPokemonAction } from "../psr-router-route-actions/SwapPokemonAction";
import { DirectionAction } from "../psr-router-route-actions/DirectionAction";
import { BSettingsAction } from "../psr-router-route-actions/BSettingsAction";

import { ARouteActionsParser } from "./ARouteActionsParser";

import { IActionParser } from "./actions/IActionParser";
import { UseActionParser } from "./actions/UseActionParser";
import { SwapActionParser } from "./actions/SwapActionParser";
import { SwapMoveActionParser } from "./actions/SwapMoveActionParser";
import { SwapPokemonActionParser } from "./actions/SwapPokemonActionParser";
import { DirectionActionParser } from "./actions/DirectionActionParser";
import { BSettingsActionParser } from "./actions/BSettingsActionParser";
import { PokemonLevelPair } from "../../psr-router-model/Model";

const parsers: { [key: string]: IActionParser } = {};
parsers[UseAction.ACTION_TYPE.toUpperCase()] = new UseActionParser();
parsers[SwapAction.ACTION_TYPE.toUpperCase()] = new SwapActionParser();
parsers[SwapMoveAction.ACTION_TYPE.toUpperCase()] = new SwapMoveActionParser();
parsers[SwapPokemonAction.ACTION_TYPE.toUpperCase()] = new SwapPokemonActionParser();
parsers[DirectionAction.ACTION_TYPE.toUpperCase()] = new DirectionActionParser();
parsers[BSettingsAction.ACTION_TYPE.toUpperCase()] = new BSettingsActionParser();

/**
 * lines:
 * E: <pokemon>:<level> [[:: <title>] :: <summary>]
 *     [<action>
 *      ..]
 *
 * json:
 * {
 *     type,
 *     info: { title, summary, description },
 *     location, // TODO
 *     properties: {
 *         encounter: { pokemon, level },
 *         actions
 *     }
 * }
 */
export class RouteEncounterParser extends ARouteActionsParser {
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
        let [encounter, title, ...summ] = scopedLine.untypedLine.split("::");
        if (!encounter) {
            throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Please provide a pokemon-level pair`, "Parser Error");
        }
        title = title ? title.trim() : "";
        let [pokemon, l] = encounter.split(":");
        let level = parseInt(l);
        if (!pokemon || isNaN(level)) {
            throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Invalid pokemon-level pair "${encounter}"`, "Parser Error");
        }
        entry.properties.encounter = { pokemon, level };
        let summary = summ.length > 0 ? summ.join("::").trim() : title;
        entry.info = { title: summ.length > 0 ? title : "", summary: summary, description: "" };

        return entry;
    }

    public jsonToLines(jsonEntry: EntryJSON): ScopedLine {
        // TODO: test
        let scopedLine = super.jsonToLines(jsonEntry);
        let line = `${RouteEncounter.ENTRY_TYPE}: ${jsonEntry.properties.encounter.pokemon}:${jsonEntry.properties.encounter.level}`;
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