import { ScopedLine } from "../ScopedLine";
import { ActionJSON } from "./ActionJSON";

export interface IActionParser {
    linesToJSON(scopedLine: ScopedLine, filename: string): ActionJSON;
    jsonToLines(jsonEntry: ActionJSON): ScopedLine;
}
