import { ActionJSON } from "./ActionJSON";
import { IActionParser } from "./IActionParser";
import { ScopedLine } from "../ScopedLine";
import * as Util from '../../../psr-router-util';

/**
 * lines:
 * SwapP: <index> [<index>] [:: <description>]
 *
 * json:
 * {
 *     type,
 *     description,
 *     properties: {
 *         partyIndex1, partyIndex2
 *     }
 * }
 */
export class SwapPokemonActionParser implements IActionParser {
    public linesToJSON(scopedLine: ScopedLine, filename: string): ActionJSON {
        // TODO: option to let the swapped in pokemon die if in battle?
        let valuesText = scopedLine.untypedLine;
        let description;
        if (valuesText.indexOf('::') >= 0) {
            [valuesText, description] = [valuesText.substr(0, valuesText.indexOf('::')).trim(), valuesText.substr(valuesText.indexOf('::') + 2).trim()];
        }
        let values = valuesText.split(/[, ]/).filter(v => !!v);
        if (values.length < 1 || values.length > 2) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} 'SwapP' takes 1 or 2 parameters`, "Parser Error");

        let partyIndex1 = +values[0] - 1;
        let partyIndex2 = values[1] ? +values[1] - 1 : undefined;
        if (isNaN(partyIndex1) || partyIndex1 < 0) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Index must be a positive number`, "Parser Error");
        if (!isNaN(partyIndex2) && partyIndex2 < 0) throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Index must be a positive number`, "Parser Error");

        return new ActionJSON(scopedLine.type, description, { partyIndex1, partyIndex2 });
    }

    public jsonToLines(jsonEntry: ActionJSON): ScopedLine {
        let val1 = +jsonEntry.properties.partyIndex1 + 1;
        let line = `${jsonEntry.type}: ${val1}`;
        if (jsonEntry.properties.partyIndex2) {
            let val2 = +jsonEntry.properties.partyIndex2 + 1;
            line = `${line} ${val2}`;
        }
        if (jsonEntry.description) {
            line = `${line} :: ${jsonEntry.description}`;
        }
        return new ScopedLine(line);
    }
}
