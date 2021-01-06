// TODO: naming?
import { ActionJSON } from "./ActionJSON";
import { IActionParser } from "./IActionParser";
import { ScopedLine } from "../ScopedLine";
import { RouterError } from "SharedModules/psr-router-util";

/**
 * lines:
 * BSettings: <party index:1> [:: <description>]
 *     <key>: <value>
 *     [<key>: <value>
 *      ..]
 *
 * json:
 * {
 *     type,
 *     description,
 *     properties: {
 *         partyIndex,
 *         settings: { key, value[] }[]
 *     }
 * }
 */
export class BSettingsActionParser implements IActionParser {
    public linesToJSON(scopedLine: ScopedLine, filename: string): ActionJSON {
        let [partyIndex, ...description] = scopedLine.untypedLine.split("::");
        partyIndex = partyIndex.trim();
        if (partyIndex.trim() == "") {
            partyIndex = "1"
        } else if (isNaN(+partyIndex) || +partyIndex < 1 || +partyIndex > 6) {
            throw new RouterError(`${filename}:${scopedLine.ln + 1} Party index must be a number between 1 and 6`, "Parser Error");
        }
        let properties: any = {};
        properties.partyIndex = +partyIndex - 1;
        properties.settings = [];
        scopedLine.scope.forEach(sl => {
            properties.settings.push({ key: sl.type, value: sl.untypedLine.split(" ").filter(s => !!s) });
        });
        return new ActionJSON(scopedLine.type, description.join("::").trim(), properties);
    }

    public jsonToLines(jsonEntry: ActionJSON): ScopedLine {
        let untypedLine = `${jsonEntry.properties.partyIndex + 1}`;
        if (!!jsonEntry.description) {
            untypedLine = `${untypedLine} :: ${jsonEntry.description}`;
        }
        let scopedLine = new ScopedLine(`${jsonEntry.type}: ${untypedLine}`);
        if (jsonEntry.properties.settings) {
            let settings: { key: string, value: string[] }[] = jsonEntry.properties.settings;
            settings.forEach(kv => scopedLine.scope.push(new ScopedLine(`${kv.key}: ${kv.value.join(' ')}`)));
        }
        return scopedLine;
    }
}
