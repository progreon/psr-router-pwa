import { EntryJSON } from "./EntryJSON";
import { IRouteEntryParser } from "./IRouteEntryParser";
import { ScopedLine } from "./ScopedLine";
import * as Util from '../../psr-router-util';
import { RouteGetPokemon } from "../RouteGetPokemon";

/**
 * lines:
 * GetP: [#]<option> [[#]<option> [..]]
 *     [<title> ::] <summary>
 *     <description lines>
 * with <option> = <pokemon>:<level>
 * only one preferred option (with '#') allowed
 *
 * json:
 * {
 *     type,
 *     info: { title, summary, description },
 *     location, // TODO
 *     properties: {
 *         choices: { pokemon, level }[],
 *         preference
 *     }
 * }
 */
export class RouteGetPokemonParser implements IRouteEntryParser {
    public linesToJSON(scopedLine: ScopedLine, filename: string): EntryJSON {
        let entry = new EntryJSON(scopedLine.type);
        entry.properties.choices = [];
        // e.g. "pikachu:5  #bulbasaur:5"
        let choices = scopedLine.untypedLine.split(" ").filter(spl => !!spl); // filter out the empty strings (in case of multiple spaces)
        let preference = 0;
        for (let i = 0; i < choices.length; i++) {
            if (choices[i]) { // in case of choices separated by multiple spaces
                let [pokemon, l] = choices[i].split(":");
                let level = parseInt(l);
                if (pokemon && !isNaN(level)) {
                    if (pokemon.startsWith("#")) {
                        if (entry.properties.preference == undefined) {
                            entry.properties.preference = preference;
                        } else {
                            throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Only one preffered option allowed`, "Parser Error");
                        }
                        pokemon = pokemon.substring(1);
                    }
                } else {
                    throw new Util.RouterError(`${filename}:${scopedLine.ln + 1} Invalid pokemon-level pair "${choices[i]}"`, "Parser Error");
                }
                entry.properties.choices.push({ pokemon, level });
                preference++;
            }
        }
        if (scopedLine.scope && scopedLine.scope.length > 0) {
            let titleLine = scopedLine.scope.shift();
            let [tOrS, ...s] = titleLine.line.split("::");
            let summ = s && s.length > 0 ? s.join("::").trim() : "";
            entry.info = { title: summ ? tOrS.trim() : "", summary: summ || tOrS, description: "" };
            entry.info.description = scopedLine.scope.map(l => l.line).join("\n");
        }
        return entry;
    }
    public jsonToLines(jsonEntry: EntryJSON): ScopedLine {
        let scopedLine = new ScopedLine(RouteGetPokemon.ENTRY_TYPE + ":");
        for (let i = 0; i < jsonEntry.properties.choices.length; i++) {
            scopedLine.line += ` ${jsonEntry.properties.preference == i ? "#" : ""}${jsonEntry.properties.choices[i].pokemon}:${jsonEntry.properties.choices[i].level}`;
        }
        if (jsonEntry.info) {
            if (jsonEntry.info.summary) {
                scopedLine.scope.push(new ScopedLine((jsonEntry.info.title ? jsonEntry.info.title + " :: " : "") + jsonEntry.info.summary));
                if (jsonEntry.info.description) {
                    jsonEntry.info.description.split("\n").forEach(d => scopedLine.scope.push(new ScopedLine(d.trim())));
                }
            } else {
                // TODO
            }
        }
        return scopedLine;
    }
}
