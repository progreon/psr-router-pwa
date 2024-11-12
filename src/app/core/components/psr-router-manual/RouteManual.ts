// import { RowData } from '@tanstack/table-core';

export class RouteManual {
  private entries: { [key: string]: RouteManualEntry } = {};

  add(entry: RouteManualEntry) {
    if (this.entries[entry.key]) {
      throw new Error(`Entry with key ${entry.key} already exists!`);
    }
    this.entries[entry.key] = entry;
    return this;
  }

  get(key: string) {
    return this.entries[key];
  }

  getKeys() {
    return Object.keys(this.entries);
  }

  getValues() {
    return Object.values(this.entries);
  }

  static from(entries: RouteManualEntry[]) {
    let manual = new RouteManual();
    entries.forEach(e => manual.add(e));
    return manual;
  }
}

export class RouteManualEntry {
  key: string;
  title: string;
  type: string;
  description?: string;
  note?: string;
  rf1Code?: string;
  jsonCode?: string;
  // rf1ExampleCode?: string;
  params?: RouteManualData[] = [];

  constructor(options: RouteManualData) {
    // a trick to keep the default values
    Object.keys(options).forEach(o => {
      this[o] = options[o];
    });
  }
}

export class RouteManualData {
  name: string;
  description?: string;
  type?: string = "string";
  optional?: boolean = false;
  default?: string;
  options?: { value: string, comment?: string }[] = [];

  constructor(options: RouteManualData) {
    // a trick to keep the default values
    Object.keys(options).forEach(o => {
      this[o] = options[o];
    });
  }
}