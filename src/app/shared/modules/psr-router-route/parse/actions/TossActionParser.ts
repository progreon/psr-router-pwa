import { ActionJSON } from "./ActionJSON";
import { IActionParser } from "./IActionParser";
import { ScopedLine } from "../ScopedLine";
import * as Util from '../../../psr-router-util';

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
        let valuesText = scopedLine.untypedLine;
        let description;
        if (valuesText.indexOf('::') >= 0) {
            [valuesText, description] = [valuesText.substr(0, valuesText.indexOf('::')).trim(), valuesText.substr(valuesText.indexOf('::') + 2).trim()];
        }
        let values = valuesText.split(/[, ]/).filter(v => !!v);
        if (values.length != 2) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} 'Toss' takes 2 parameters`, "Parser Error");

        let item: string, count: string;
        item = values[0];
        if (values.length > 1) {
            count = values[1];
            if (isNaN(+count) && (count !== "?" || +count < 0)) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Count must be a positive number or '?'`, "Parser Error");
        }

        return new ActionJSON(scopedLine.type, description, { item, count });
    }

    public jsonToLines(jsonEntry: ActionJSON): ScopedLine {
        let line = `${jsonEntry.type}: ${jsonEntry.properties.item}`;
        if (jsonEntry.properties.count) {
            line = `${line} ${jsonEntry.properties.count}`;
        }
        if (jsonEntry.description) {
            line = `${line} :: ${jsonEntry.description}`;
        }
        return new ScopedLine(line);
    }
}
