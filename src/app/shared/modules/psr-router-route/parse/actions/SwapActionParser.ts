import { ActionJSON } from "./ActionJSON";
import { IActionParser } from "./IActionParser";
import { ScopedLine } from "../ScopedLine";

/**
 * lines:
 * Swap: <index|item> <index|item> :: <description>
 *
 * json:
 * {
 *     type,
 *     description,
 *     properties: {
 *         itemIndex1, itemIndex2,
 *         item1, item2
 *     }
 * }
 */
export class SwapActionParser implements IActionParser {
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
