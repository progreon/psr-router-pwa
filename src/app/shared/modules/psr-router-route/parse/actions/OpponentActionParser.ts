// TODO: naming?
import { ActionJSON } from "./ActionJSON";
import { IActionParser } from "./IActionParser";
import { ScopedLine } from "../ScopedLine";

/**
 * lines:
 * Opp: <opp index> :: <description>
 *     <action>
 *     [<action>
 *     ...]
 *
 * json:
 * {
 *     type,
 *     description,
 *     properties: {
 *         opponent
 *     }
 *     actions
 * }
 */
export class OpponentActionParser implements IActionParser {
    public linesToJSON(scopedLine: ScopedLine, filename: string): ActionJSON {
        // TODO
        throw new Error("Method not implemented.");
        return new ActionJSON(scopedLine.type, scopedLine.line);
    }

    public jsonToLines(jsonEntry: ActionJSON): ScopedLine {
        let scopedLine = new ScopedLine(jsonEntry.type + ":");
        // TODO
        throw new Error("Method not implemented.");
        return scopedLine;
    }
}
