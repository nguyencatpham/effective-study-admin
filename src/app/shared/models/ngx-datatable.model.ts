export interface ColumnInfo {
  canAutoResize: boolean;
  draggable: boolean;
  dragging: boolean;
  name: string;
  prop: string;
  resizeable: boolean;
  sortable: boolean;
  width: string;
}

export interface SortEvent {
  column: ColumnInfo;
  sorts: Array<{
    dir: string,
    prop: string
  }>;
}

export interface SelectEvent {
  selected: Array<{}>;
}

export interface RowSelectEvent {
  cellElement: any;
  cellIndex: number;
  rowElement: any;
  column: ColumnInfo;
  event: MouseEvent;
  row: any;
  type: string;
  value: string;
}
