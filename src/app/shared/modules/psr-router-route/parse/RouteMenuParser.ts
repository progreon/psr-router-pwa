import { EntryJSON } from "./EntryJSON";
import { IRouteEntryParser } from "./IRouteEntryParser";
import { ScopedLine } from "./ScopedLine";
import * as Util from '../../psr-router-util';
import { RouteMenu } from "../RouteMenu";

/**
 * lines:
 * Menu: [<title> ::] <summary>
 *     <option> [:: <description>]
 *     [<option> [:: <description>]
 *      ..]
 * with <option> being one of the following:
 *     Use: <item> [<count:1> [<pokemon index:1> [<move index:1>]]]
 *     Swap: <index|item> <index|item>
 *     Teach: <tm|hm> [<pokemon index:1> [<move index:1>]]
 *     Toss: <item> [<count:1>]
 *     [D:] <description>
 *
 * json:
 * {
 *     type,
 *     info: { title, summary, description },
 *     location, // TODO
 *     properties: {
 *         actions: { type, description, item1, item2, index1, index2, count }[]
 *     }
 * }
 */
export class RouteMenuParser implements IRouteEntryParser {
    public linesToJSON(scopedLine: ScopedLine, filename: string): EntryJSON {
        let entry = new EntryJSON(scopedLine.type);
        entry.properties.actions = [];
        if (scopedLine.scope) {
            scopedLine.scope.forEach(line => {
                console.log(line);
                let [type, valuesText] = [line.type, line.untypedLine];
                let description;
                if (valuesText.indexOf('::') >= 0) {
                    [valuesText, description] = [valuesText.substr(0, valuesText.indexOf('::')).trim(), valuesText.substr(valuesText.indexOf('::') + 1).trim()];
                }
                let values = valuesText.split(/[, ]/).filter(v => !!v);
                let item1, item2, index1, index2, count;
                switch (type.trim().toUpperCase()) {
                    case "USE":
                        [item1, count, index1, index2] = values;
                        break;
                    case "SWAP":
                        // TODO
                        break;
                    case "TEACH":
                        // TODO
                        break;
                    case "TOSS":
                        // TODO
                        break;
                    case "D":
                    default:
                        description = valuesText;
                        break;
                }
                entry.properties.actions.push({ type, description, item1, item2, index1: +index1 - 1, index2: +index2 - 1, count });
            });
        }
        if (scopedLine.untypedLine) {
            let titleLine = scopedLine.untypedLine;
            let [tOrS, ...s] = titleLine.split("::");
            let summ = s && s.length > 0 ? s.join("::").trim() : "";
            entry.info = { title: summ ? tOrS.trim() : "", summary: summ || tOrS, description: "" };
            entry.info.description = scopedLine.scope.map(l => l.line).join("\n");
        }
        console.log(entry);
        return entry;
    }
    public jsonToLines(jsonEntry: EntryJSON): ScopedLine {
        // TODO
        let scopedLine = new ScopedLine(RouteMenu.ENTRY_TYPE + ":");
        // for (let i = 0; i < jsonEntry.properties.choices.length; i++) {
        //     scopedLine.line += ` ${jsonEntry.properties.preference == i ? "#" : ""}${jsonEntry.properties.choices[i].pokemon}:${jsonEntry.properties.choices[i].level}`;
        // }
        // if (jsonEntry.info) {
        //     if (jsonEntry.info.summary) {
        //         scopedLine.scope.push(new ScopedLine((jsonEntry.info.title ? jsonEntry.info.title + " :: " : "") + jsonEntry.info.summary));
        //         if (jsonEntry.info.description) {
        //             jsonEntry.info.description.split("\n").forEach(d => scopedLine.scope.push(new ScopedLine(d.trim())));
        //         }
        //     } else {
        //         // TODO
        //     }
        // }
        return scopedLine;
    }
}
