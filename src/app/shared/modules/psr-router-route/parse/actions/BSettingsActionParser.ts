// TODO: naming?
import { ActionJSON } from "./ActionJSON";
import { IActionParser } from "./IActionParser";
import { ScopedLine } from "../ScopedLine";
import { getDefaultFormatCodeSettings } from "typescript";

/**
 * lines:
 * BSettings: <party index:1> :: <description>
 *     <key>: <value>[]
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
        // TODO: error checking?
        let [partyIndex, ...description] = scopedLine.untypedLine.split("::");
        let properties: any = {};
        properties.partyIndex = +partyIndex.trim() - 1;
        properties.settings = [];
        scopedLine.scope.forEach(sl => {
            properties.settings.push({ key: sl.type, value: sl.untypedLine.split(" ") });
        });
        return new ActionJSON(scopedLine.type, description.join("::").trim(), properties);
    }

    public jsonToLines(jsonEntry: ActionJSON): ScopedLine {
        let untypedLine: string;
        if (jsonEntry.properties.partyIndex != null && !!jsonEntry.description) {
            untypedLine = (jsonEntry.properties.partyIndex + 1) + " :: " + jsonEntry.description;
        } else {
            untypedLine = jsonEntry.description || (+jsonEntry.properties.partyIndex + 1) + "";
        }
        let scopedLine = new ScopedLine(`${jsonEntry.type}: ${untypedLine}`);
        if (jsonEntry.properties.settings) {
            let settings: { key: string, value: string[] }[] = jsonEntry.properties.settings;
            settings.forEach(kv => scopedLine.scope.push(new ScopedLine(`${kv.key}: ${kv.value.join(' ')}`)));
        }
        return scopedLine;
    }
}
