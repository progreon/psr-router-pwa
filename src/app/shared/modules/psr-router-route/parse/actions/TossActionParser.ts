import { ActionJSON } from "./ActionJSON";
import { IActionParser } from "./IActionParser";
import { ScopedLine } from "../ScopedLine";

/**
 * lines:
 * Toss: <item> [<count:1>] :: <description>
 *
 * json:
 * {
 *     type,
 *     description,
 *     properties: {
 *         item, count
 *     }
 * }
 */
export class TossActionParser implements IActionParser {
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
