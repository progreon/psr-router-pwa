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
 *     SwapP: <index> <index>
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
                let [type, valuesText] = [line.type, line.untypedLine];
                let description;
                if (valuesText.indexOf('::') >= 0) {
                    [valuesText, description] = [valuesText.substr(0, valuesText.indexOf('::')).trim(), valuesText.substr(valuesText.indexOf('::') + 2).trim()];
                }
                let values = valuesText.split(/[, ]/).filter(v => !!v);
                if (values.length == 0) throw new Util.RouterError(`${filename}:${line.ln + 1} Missing parameters`, "Parser Error");
                let item1: string, item2: string, index1: number, index2: number, count: string;
                switch (type.trim().toUpperCase()) {
                    case "USE":
                        // Use: <item> [<count:1> [<pokemon index:1> [<move index:1>]]]
                        item1 = values[0];
                        if (values.length > 1) {
                            count = values[1];
                            if (isNaN(+count) && (count !== "?" || +count < 0)) throw new Util.RouterError(`${filename}:${line.ln + 1} Count must be a positive number or '?'`, "Parser Error");
                            if (values.length > 2) {
                                if (isNaN(+values[2]) || +values[2] < 1) throw new Util.RouterError(`${filename}:${line.ln + 1} Index must be a number > 0`, "Parser Error");
                                index1 = +values[2] - 1;
                                if (values.length > 3) {
                                    if (isNaN(+values[3]) || +values[3] < 1) throw new Util.RouterError(`${filename}:${line.ln + 1} Index must be a number > 0`, "Parser Error");
                                    index2 = +values[3] - 1;
                                }
                            }
                        }
                        break;
                    case "SWAP":
                        // Swap: <index|item> <index|item>
                        if (values.length != 2) throw new Util.RouterError(`${filename}:${line.ln + 1} 'Swap' takes 2 parameters`, "Parser Error");

                        [index1, item1] = isNaN(+values[0]) ? [+values[0] - 1, undefined] : [undefined, values[0]];
                        [index2, item2] = isNaN(+values[1]) ? [+values[1] - 1, undefined] : [undefined, values[1]];
                        if (!isNaN(index1) && index1 < 0) throw new Util.RouterError(`${filename}:${line.ln + 1} Index must be a number > 0`, "Parser Error");
                        if (!isNaN(index2) && index2 < 0) throw new Util.RouterError(`${filename}:${line.ln + 1} Index must be a number > 0`, "Parser Error");
                        break;
                    case "SWAPP":
                        // Swap: <index> <index>
                        if (values.length != 2) throw new Util.RouterError(`${filename}:${line.ln + 1} 'SwapP' takes 2 parameters`, "Parser Error");

                        index1 = +values[0] - 1;
                        index2 = +values[1] - 1;
                        if (!isNaN(index1) && index1 < 0) throw new Util.RouterError(`${filename}:${line.ln + 1} Index must be a number > 0`, "Parser Error");
                        if (!isNaN(index2) && index2 < 0) throw new Util.RouterError(`${filename}:${line.ln + 1} Index must be a number > 0`, "Parser Error");
                        break;
                    case "TEACH":
                        // Teach: <tm|hm> [<pokemon index:1> [<move index:1>]]
                        item1 = values[0];
                        if (values.length > 1) {
                            if (isNaN(+values[1]) || +values[1] < 1) throw new Util.RouterError(`${filename}:${line.ln + 1} Index must be a number > 0`, "Parser Error");
                            index1 = +values[1] - 1;
                            if (values.length > 2) {
                                if (isNaN(+values[2]) || +values[2] < 1) throw new Util.RouterError(`${filename}:${line.ln + 1} Index must be a number > 0`, "Parser Error");
                                index2 = +values[2] - 1;
                            }
                        }
                        break;
                    case "TOSS":
                        // Toss: <item> [<count:1>]
                        item1 = values[0];
                        if (values.length > 1) {
                            count = values[1];
                            if (isNaN(+count) && (count !== "?" || +count < 0)) throw new Util.RouterError(`${filename}:${line.ln + 1} Count must be a positive number or '?'`, "Parser Error");
                        }
                        break;
                    case "D":
                    default:
                        description = line.line;
                        break;
                }
                entry.properties.actions.push({ type, description, item1, item2, index1, index2, count });
            });
        }
        if (scopedLine.untypedLine) {
            let titleLine = scopedLine.untypedLine;
            let [tOrS, ...s] = titleLine.split("::");
            let summ = s && s.length > 0 ? s.join("::").trim() : "";
            entry.info = { title: summ ? tOrS.trim() : "", summary: summ || tOrS, description: "" };
        }
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
