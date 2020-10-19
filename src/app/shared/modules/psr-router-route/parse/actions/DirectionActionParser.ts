// just use RouteDirectionParser?
import { ActionJSON } from "./ActionJSON";
import { IActionParser } from "./IActionParser";
import { ScopedLine } from "../ScopedLine";

/**
 * lines:
 * <description>
 *
 * json:
 * {
 *     type,
 *     description
 * }
 */
export class DirectionActionParser implements IActionParser {
    public linesToJSON(scopedLine: ScopedLine, filename: string): ActionJSON {
        return new ActionJSON(scopedLine.type, scopedLine.line);
    }

    public jsonToLines(jsonEntry: ActionJSON): ScopedLine {
        let line = jsonEntry.description;
        if (jsonEntry.type) {
            line = jsonEntry.type + ": " + line;
        }
        return new ScopedLine(line);
    }
}
