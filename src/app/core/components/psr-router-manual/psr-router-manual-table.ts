import { css, customElement, html, LitElement, property } from "lit-element";
import { RouteManualData } from "./RouteManual";
import { createTable, getCoreRowModel, Table, TableOptionsResolved } from "@tanstack/table-core";

@customElement("psr-router-manual-table")
export class PsrRouterManualTable extends LitElement {

  @property({ type: Array })
  public data: RouteManualData[] = [];

  private table: Table<RouteManualData>;

  private manualColumns: any[] = [
    { header: "Parameter", accessorKey: "name" },
    { header: "Description", accessorKey: "description" },
    { header: "Type", accessorKey: "type" },
    { header: "Optional", accessorKey: "optional" },
    { header: "Default", accessorKey: "default" },
    { header: "Options", accessorFn: (row: RouteManualData) => row.options.map(v => (v.value && `${v.value}`) + (v.value && v.comment && ': ' || '') + (v.comment || '')).join('\n') }
  ];

  static styles = css`
    table {
      width: 100%;
      border: 1px solid rgba(0, 0, 0, .5);
      border-collapse: separate;
      border-radius: .5em;
      border-spacing: 0;
    }
    th, td {
      border-left: 1px solid rgba(0, 0, 0, .5);
      border-top: 1px solid rgba(0, 0, 0, .5);
      padding: .5em;
      text-align: left;
    }
    th {
      /* cursor: move; */
      border-top: none;
      background-color: rgba(127, 127, 127, .5);
    }
    td:first-child, th:first-child {
      border-left: none;
    }
    table > *:first-child > tr:first-child > *:first-child {
      border-top-left-radius: .5em;
    }
    table > *:first-child > tr:first-child > *:last-child {
      border-top-right-radius: .5em;
    }
    table > *:last-child > tr:last-child > *:first-child {
      border-bottom-left-radius: .5em;
    }
    table > *:last-child > tr:last-child > *:last-child {
      border-bottom-right-radius: .5em;
    }
  `;

  protected render() {
    return html`
      ${this.renderTable(this.data)}
    `;
  }

  constructor() {
    super();
    let options: TableOptionsResolved<RouteManualData> = {
      columns: this.manualColumns,
      data: this.data,
      getCoreRowModel: getCoreRowModel(),
      state: {},
      onStateChange: () => { },
      renderFallbackValue: null
    };
    this.table = createTable(options);
    this.table.options.state = { ...this.table.initialState };
  }

  private renderTable(data: RouteManualData[]) {
    this.table.setOptions({
      columns: this.manualColumns,
      data: data,
      getCoreRowModel: getCoreRowModel(),
      state: this.table.getState(),
      onStateChange: () => { },
      renderFallbackValue: null
    });

    return html`
      <table>
        <thead>
        ${this.table.getHeaderGroups().map(headerGroup => html`
          <tr>${headerGroup.headers.map(header => html`
            <th>${header.column.columnDef.header}</th>
            `)}
          </tr>
        `)}
        </thead>
        <tbody>
        ${this.table.getRowModel().rows.map(row => html`
          <tr>
          ${row.getVisibleCells().map(cell => html`
            <td><code style="white-space: pre-wrap;">${cell.getValue()}</code></td>
          `)}
          </tr>
        `)}
        </tbody>
      </table>
    `;
  }

  // @query("#table") 
  // private table: HTMLTableElement;
  // @queryAll("#table>thead>tr>th")
  // private headers: HTMLTableCellElement[];
  // private draggedColumnIndex = null;

  // protected firstUpdated(_changedProperties: PropertyValues): void {
  //   console.log("firstUpdated", this.table, this.headers);
  //   this.headers.forEach((header, index) => {
  //     header.addEventListener("dragstart", e => {
  //       this.draggedColumnIndex = index;
  //       e.dataTransfer.effectAllowed = "move";
  //       e.dataTransfer.setData("text/plain", index + "");
  //     });

  //     header.addEventListener("dragover", e => {
  //       e.preventDefault();
  //     })

  //     header.addEventListener("drop", e => {
  //       e.preventDefault();

  //       const targetColumnIndex = index;

  //       if (this.draggedColumnIndex !== null && this.draggedColumnIndex !== targetColumnIndex) {
  //         // Swap colums in the table
  //         this.swapTableColumns(this.draggedColumnIndex, targetColumnIndex);
  //         this.draggedColumnIndex = null;
  //       }
  //     })
  //   })
  // }

  // private swapTableColumns(colIndex1: number, colIndex2: number) {
  //   const rows = this.table.rows;
  //   for (let row of rows) {
  //     const cells = row.cells;
  //     row.insertBefore(cells[colIndex2], cells[colIndex1]);
  //   }
  // }
}