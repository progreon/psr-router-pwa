import { EntryJSON } from "./EntryJSON";
import { ScopedLine } from "./ScopedLine";

import { IRouteEntryParser } from "./IRouteEntryParser";
import { ActionJSON } from "./actions/ActionJSON";
import { IActionParser } from "./actions/IActionParser";

/**
 * lines:
 * <type>: <entry params>
 *     <action entries>
 *
 * json:
 * {
 *     type,
 *     properties: { actions }
 * }
 */
export abstract class ARouteActionsParser implements IRouteEntryParser {
    public abstract get parsers(): { [key: string]: IActionParser };
    public abstract get defaultParser(): IActionParser;

    public linesToJSON(scopedLine: ScopedLine, filename: string): EntryJSON {
        let entry = new EntryJSON(scopedLine.type);
        let actions: ActionJSON[] = [];

        scopedLine.scope.forEach(scopedLine => {
            let parser = this.parsers[scopedLine.type.toUpperCase()] || this.defaultParser;
            if (parser) {
                actions.push(parser.linesToJSON(scopedLine, filename));
            } else {
                console.warn("Unknown action for type", scopedLine.type);
            }
        });

        entry.properties.actions = actions;
        return entry;
    }

    public jsonToLines(jsonEntry: EntryJSON): ScopedLine {
        let scopedLine = new ScopedLine();

        let actions: ActionJSON[] = jsonEntry.properties.actions || [];
        actions.forEach(action => {
            let parser = this.parsers[action.type.toUpperCase()] || this.defaultParser;
            if (parser) {
                scopedLine.scope.push(parser.jsonToLines(action));
            } else {
                console.warn("Unknown action for type", action.type);
            }
        });

        return scopedLine;
    }
}
