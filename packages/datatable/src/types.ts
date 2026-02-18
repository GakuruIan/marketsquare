// src/types.ts
import { Table } from "@tanstack/react-table";

export interface DataTableProps<T> {
  table: Table<T>;
  emptyMessage?: string;
}
