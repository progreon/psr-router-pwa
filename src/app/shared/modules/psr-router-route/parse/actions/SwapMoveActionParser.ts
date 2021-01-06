import { ActionJSON } from "./ActionJSON";
import { IActionParser } from "./IActionParser";
import { ScopedLine } from "../ScopedLine";
import * as Util from '../../../psr-router-util';

/**
 * lines:
 * SwapM: <index|move> <index|move> :: <description>
 *
 * json:
 * {
 *     type,
 *     description,
 *     properties: {
 *         moveIndex1, moveIndex2,
 *         move1, move2
 *     }
 * }
 */
export class SwapMoveActionParser implements IActionParser {
    public linesToJSON(scopedLine: ScopedLine, filename: string): ActionJSON {
        let valuesText = scopedLine.untypedLine;
        let description;
        if (valuesText.indexOf('::') >= 0) {
            [valuesText, description] = [valuesText.substr(0, valuesText.indexOf('::')).trim(), valuesText.substr(valuesText.indexOf('::') + 2).trim()];
        }
        let values = valuesText.split(/[, ]/).filter(v => !!v);
        if (values.length != 2) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} 'Swap' takes 2 parameters`, "Parser Error");

        let move1: string, move2: string, moveIndex1: number, moveIndex2: number;
        [moveIndex1, move1] = isNaN(+values[0]) ? [undefined, values[0]] : [+values[0] - 1, undefined];
        [moveIndex2, move2] = isNaN(+values[1]) ? [undefined, values[1]] : [+values[1] - 1, undefined];
        if (!isNaN(moveIndex1) && (moveIndex1 < 0 || moveIndex1 > 3)) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Index must be a number between 1 and 4`, "Parser Error");
        if (!isNaN(moveIndex2) && (moveIndex2 < 0 || moveIndex2 > 3)) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Index must be a number between 1 and 4`, "Parser Error");

        return new ActionJSON(scopedLine.type, description, { moveIndex1, moveIndex2, move1, move2 });
    }

    public jsonToLines(jsonEntry: ActionJSON): ScopedLine {
        let val1 = jsonEntry.properties.move1 || (+jsonEntry.properties.moveIndex1 + 1);
        let val2 = jsonEntry.properties.move2 || (+jsonEntry.properties.moveIndex2 + 1);
        let line = `${jsonEntry.type}: ${val1} ${val2}`;
        if (jsonEntry.description) {
            line = `${line} :: ${jsonEntry.description}`;
        }
        return new ScopedLine(line);
    }
}
