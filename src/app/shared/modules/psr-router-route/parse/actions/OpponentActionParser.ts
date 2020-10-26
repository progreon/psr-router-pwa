// TODO: naming?
import { ActionJSON } from "./ActionJSON";
import { IActionParser } from "./IActionParser";
import { ScopedLine } from "../ScopedLine";
import * as Util from '../../../psr-router-util';
import { RouteBattleParser } from "../RouteBattleParser";

/**
 * lines:
 * Opp: <opp index> [:: [*]<party index:1> [[*]<party index> [..]]]
 *     <action>
 *     [<action>
 *     ...]
 * with '*' indicating that it dies here and doesn't get experience
 *
 * json:
 * {
 *     type,
 *     properties: {
 *         oppIndex,
 *         entrants: { partyIndex, faint }[]
 *     }
 *     actions
 * }
 */
export class OpponentActionParser implements IActionParser {
    public linesToJSON(scopedLine: ScopedLine, filename: string): ActionJSON {
        let entry = new ActionJSON(scopedLine.type);

        let [oppIndex, battlers] = scopedLine.untypedLine.split("::").map(s => s.trim());
        if (isNaN(+oppIndex)) {
            throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Please provide an opponent index`, "Parser Error");
        }
        entry.properties.oppIndex = +oppIndex - 1;
        let entrants: { partyIndex: number, faint?: boolean }[] = [];
        if (battlers) {
            // eg: "0  *1"
            let es = battlers.split(" ").filter(spl => !!spl); // filter out the empty strings (in case of multiple spaces)
            es.forEach(e => {
                let faint = e.startsWith("*");
                if (faint) e = e.substr(1);
                if (isNaN(+e)) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Invalid party index: ${e}`, "Parser Error");
                let entr: { partyIndex: number, faint?: boolean } = { partyIndex: +e - 1 };
                if (faint) entr.faint = true;
                entrants.push(entr);
            });
        }
        entry.properties.entrants = entrants;

        let actions: ActionJSON[] = [];
        scopedLine.scope.forEach(scopedLine => {
            let parser = RouteBattleParser.PARSERS[scopedLine.type.toUpperCase()];
            if (parser && parser != this) {
                actions.push(parser.linesToJSON(scopedLine, filename));
            } else {
                // TODO: throw exception?
                console.warn("Unknown action for type", scopedLine.type);
            }
        });
        entry.actions = actions;

        return entry;
    }

    public jsonToLines(jsonEntry: ActionJSON): ScopedLine {
        let line = `${jsonEntry.type}: ${+jsonEntry.properties.oppIndex + 1}`;
        if (jsonEntry.properties.entrants) {
            line = `${line} ::`;
            let entrants: { partyIndex: number, faint?: boolean }[] = jsonEntry.properties.entrants;
            entrants.forEach(e => {
                line = `${line} :: ${e.faint ? "*" : ""}${e.partyIndex + 1}`;
            });
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
