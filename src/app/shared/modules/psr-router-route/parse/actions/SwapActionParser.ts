import { ActionJSON } from "./ActionJSON";
import { IActionParser } from "./IActionParser";
import { ScopedLine } from "../ScopedLine";
import * as Util from '../../../psr-router-util';

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
        let valuesText = scopedLine.untypedLine;
        let description;
        if (valuesText.indexOf('::') >= 0) {
            [valuesText, description] = [valuesText.substr(0, valuesText.indexOf('::')).trim(), valuesText.substr(valuesText.indexOf('::') + 2).trim()];
        }
        let values = valuesText.split(/[, ]/).filter(v => !!v);
        if (values.length != 2) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} 'Swap' takes 2 parameters`, "Parser Error");

        let item1: string, item2: string, itemIndex1: number, itemIndex2: number;
        [itemIndex1, item1] = isNaN(+values[0]) ? [undefined, values[0]] : [+values[0] - 1, undefined];
        [itemIndex2, item2] = isNaN(+values[1]) ? [undefined, values[1]] : [+values[1] - 1, undefined];
        if (!isNaN(itemIndex1) && itemIndex1 < 0) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Index must be a number > 0`, "Parser Error");
        if (!isNaN(itemIndex2) && itemIndex2 < 0) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Index must be a number > 0`, "Parser Error");

        return new ActionJSON(scopedLine.type, description, { itemIndex1, itemIndex2, item1, item2 });
    }

    public jsonToLines(jsonEntry: ActionJSON): ScopedLine {
        let val1 = jsonEntry.properties.item1 || (+jsonEntry.properties.itemIndex1 + 1);
        let val2 = jsonEntry.properties.item2 || (+jsonEntry.properties.itemIndex2 + 1);
        let line = `${jsonEntry.type}: ${val1} ${val2}`;
        if (jsonEntry.description) {
            line = `${line} :: ${jsonEntry.description}`;
        }
        return new ScopedLine(line);
    }
}
