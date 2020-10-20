import { ActionJSON } from "./ActionJSON";
import { IActionParser } from "./IActionParser";
import { ScopedLine } from "../ScopedLine";
import * as Util from '../../../psr-router-util';

/**
 * lines:
 * Use: <item> [<count:1> [<pokemon index:1> [<move index:1>]]] :: <description>
 *
 * json:
 * {
 *     type,
 *     description,
 *     properties: {
 *         item, count, partyIndex, moveIndex
 *     }
 * }
 */
export class UseActionParser implements IActionParser {
    public linesToJSON(scopedLine: ScopedLine, filename: string): ActionJSON {
        let valuesText = scopedLine.untypedLine;
        let description;
        if (valuesText.indexOf('::') >= 0) {
            [valuesText, description] = [valuesText.substr(0, valuesText.indexOf('::')).trim(), valuesText.substr(valuesText.indexOf('::') + 2).trim()];
        }
        let values = valuesText.split(/[, ]/).filter(v => !!v);
        if (values.length == 0) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} 'Use' takes 2 parameters`, "Parser Error");

        let item: string, count: string, partyIndex: number, moveIndex: number;
        item = values[0];
        if (values.length > 1) {
            count = values[1];
            if (isNaN(+count) && (count !== "?" || +count < 0)) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Count must be a positive number or '?'`, "Parser Error");
            if (values.length > 2) {
                if (isNaN(+values[2]) || +values[2] < 1) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Index must be a number > 0`, "Parser Error");
                partyIndex = +values[2] - 1;
                if (values.length > 3) {
                    if (isNaN(+values[3]) || +values[3] < 1) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Index must be a number > 0`, "Parser Error");
                    moveIndex = +values[3] - 1;
                }
            }
        }

        return new ActionJSON(scopedLine.type, description, { item, count, partyIndex, moveIndex });
    }

    public jsonToLines(jsonEntry: ActionJSON): ScopedLine {
        let line = `${jsonEntry.type}: ${jsonEntry.properties.tm}`;
        if (jsonEntry.properties.count) {
            line = `${line} ${jsonEntry.properties.count}`;
            if (jsonEntry.properties.partyIndex) {
                line = `${line} ${+jsonEntry.properties.partyIndex - 1}`;
                if (jsonEntry.properties.moveIndex) {
                    line = `${line} ${+jsonEntry.properties.moveIndex - 1}`;
                }
            }
        }
        if (jsonEntry.description) {
            line = `${line} :: ${jsonEntry.description}`;
        }
        return new ScopedLine(line);
    }
}
