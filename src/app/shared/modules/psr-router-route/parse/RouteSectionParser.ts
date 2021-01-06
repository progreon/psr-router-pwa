import { EntryJSON } from "./EntryJSON";
import { ScopedLine } from "./ScopedLine";
import * as Route from '..';

import { IRouteEntryParser } from "./IRouteEntryParser";
import { RouteBattleParser } from '../parse/RouteBattleParser';
import { RouteDirectionsParser } from '../parse/RouteDirectionsParser';
import { RouteEncounterParser } from '../parse/RouteEncounterParser';
import { RouteEntryParser } from '../parse/RouteEntryParser';
import { RouteManipParser } from '../parse/RouteManipParser';
import { RouteGetPokemonParser } from '../parse/RouteGetPokemonParser';
import { RouteMenuParser } from '../parse/RouteMenuParser';

/**
 * lines:
 * S: <title> [:: <summary>]
 *     <child entries>
 *
 * json:
 * {
 *     type,
 *     info: { title, summary, description },
 *     location, // TODO
 *     entries
 * }
 */
export class RouteSectionParser implements IRouteEntryParser {
    static parsers: { [key: string]: IRouteEntryParser } = {};

    public linesToJSON(scopedLine: ScopedLine, filename: string): EntryJSON {
        let entry = new EntryJSON(scopedLine.type);
        let [title, ...summary] = scopedLine.untypedLine.split("::");
        entry.info = { title: title.trim(), summary: summary.join("::").trim(), description: "" };
        entry.entries = scopedLine.scope ? this.parseLinesScopeToJSON(scopedLine.scope, filename) : [];
        // TODO: Message if empty section? If so, when?
        return entry;
    }

    public parseLinesScopeToJSON(scope: ScopedLine[], filename: string): EntryJSON[] {
        let entries: EntryJSON[] = [];
        scope.forEach(scopedLine => {
            let parser = RouteSectionParser.parsers[scopedLine.type.toUpperCase()];
            if (!parser) {
                parser = new RouteDirectionsParser();
            }
            entries.push(parser.linesToJSON(scopedLine, filename));
        });
        return entries;
    }

    public jsonToLines(jsonEntry: EntryJSON): ScopedLine {
        let scopedLine = new ScopedLine();
        if (jsonEntry.info) {
            if (jsonEntry.info.title) {
                scopedLine.line = Route.RouteSection.ENTRY_TYPE + ": " + jsonEntry.info.title + (jsonEntry.info.summary ? " :: " + jsonEntry.info.summary : "");
                scopedLine.scope = this.parseJSONScopeToLines(jsonEntry.entries ? jsonEntry.entries : []);
            } else {
                // TODO
            }
        }
        return scopedLine;
    }

    public parseJSONScopeToLines(jsonEntries: EntryJSON[] = []) {
        let lines: ScopedLine[] = [];
        jsonEntries.forEach(jsonEntry => {
            let parser = RouteSectionParser.parsers[jsonEntry.type.toUpperCase()];
            if (!parser) {
                parser = new RouteDirectionsParser();
            }
            lines.push(parser.jsonToLines(jsonEntry));
        });
        return lines;
    }
}

RouteSectionParser.parsers[Route.RouteBattle.ENTRY_TYPE.toUpperCase()] = new RouteBattleParser();
RouteSectionParser.parsers[Route.RouteDirections.ENTRY_TYPE.toUpperCase()] = new RouteDirectionsParser();
RouteSectionParser.parsers[Route.RouteEncounter.ENTRY_TYPE.toUpperCase()] = new RouteEncounterParser();
RouteSectionParser.parsers[Route.RouteEntry.ENTRY_TYPE.toUpperCase()] = new RouteEntryParser();
RouteSectionParser.parsers[Route.RouteManip.ENTRY_TYPE.toUpperCase()] = new RouteManipParser();
RouteSectionParser.parsers[Route.RouteGetPokemon.ENTRY_TYPE.toUpperCase()] = new RouteGetPokemonParser();
RouteSectionParser.parsers[Route.RouteSection.ENTRY_TYPE.toUpperCase()] = new RouteSectionParser();
RouteSectionParser.parsers[Route.RouteMenu.ENTRY_TYPE.toUpperCase()] = new RouteMenuParser();
