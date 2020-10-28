import { ActionJSON } from "./ActionJSON";
import { IActionParser } from "./IActionParser";
import { ScopedLine } from "../ScopedLine";
import * as Util from '../../../psr-router-util';

/**
 * lines:
 * Tm: <tm|hm> [<pokemon index:1> [<move index:1>]] :: <description>
 *
 * json:
 * {
 *     type,
 *     description,
 *     properties: {
 *         tm,
 *         partyIndex,
 *         moveIndex
 *     }
 * }
 */
export class TmActionParser implements IActionParser {
    public linesToJSON(scopedLine: ScopedLine, filename: string): ActionJSON {
        let valuesText = scopedLine.untypedLine;
        let description;
        if (valuesText.indexOf('::') >= 0) {
            [valuesText, description] = [valuesText.substr(0, valuesText.indexOf('::')).trim(), valuesText.substr(valuesText.indexOf('::') + 2).trim()];
        }
        let values = valuesText.split(/[, ]/).filter(v => !!v);
        if (values.length == 0) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} 'Tm' takes 1 or more parameters`, "Parser Error");

        let tm: string, partyIndex: number, moveIndex: number;
        tm = values[0];
        if (values.length > 1) {
            if (isNaN(+values[1]) || +values[1] < 1) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Party index must be a number > 0`, "Parser Error");
            partyIndex = +values[1] - 1;
            if (values.length > 2) {
                if (isNaN(+values[2]) || +values[2] < 1) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Move index must be a number > 0`, "Parser Error");
                moveIndex = +values[2] - 1;
            }
        }

        return new ActionJSON(scopedLine.type, description, { tm, partyIndex, moveIndex });
    }

    public jsonToLines(jsonEntry: ActionJSON): ScopedLine {
        let line = `${jsonEntry.type}: ${jsonEntry.properties.tm}`;
        if (jsonEntry.properties.partyIndex) {
            line = `${line} ${+jsonEntry.properties.partyIndex - 1}`;
            if (jsonEntry.properties.moveIndex) {
                line = `${line} ${+jsonEntry.properties.moveIndex - 1}`;
            }
        }
        if (jsonEntry.description) {
            line = `${line} :: ${jsonEntry.description}`;
        }
        return new ScopedLine(line);
    }
}
