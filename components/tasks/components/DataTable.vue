<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/vue-table";
import type { Task } from "../data/schema";

import { valueUpdater } from "@/lib/utils";
import NumberFlow from "@number-flow/vue";
import {
  FlexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { watch } from "vue";
import DataTablePagination from "./DataTablePagination.vue";
import DataTableToolbar from "./DataTableToolbar.vue";

interface DataTableProps {
  columns: ColumnDef<Task, any>[];
  data: Task[];
}
const props = defineProps<DataTableProps>();

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
  },
  enableGrouping: true,
  enableRowSelection: true,
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, rowSelection),
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  getGroupedRowModel: getGroupedRowModel(),
});

// Watch the grouping state and update column visibility
watch(
  () => table.getState().grouping,
  (newGrouping) => {
    const newVisibility: VisibilityState = {};
    // Hide all columns that are currently grouped
    newGrouping.forEach((columnId) => {
      newVisibility[columnId] = false;
    });
    // Merge with existing visibility, ensuring non-grouped columns remain unchanged
    columnVisibility.value = {
      ...table.getState().columnVisibility,
      ...newVisibility,
    };
  },
  { immediate: true }, // Run immediately to apply initial state
);
</script>

<template>
  <div class="space-y-4">
    <DataTableToolbar :table="table" />
    <div class="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <!-- Check if grouping is applied -->
          <template v-if="table.getState().grouping.length > 0">
            <!-- Grouped View -->
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <!-- Group Header Row -->
              <TableRow>
                <TableCell :colspan="columns.length" class="bg-neutral-50">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <Icon name="i-lucide-calendar" />

                      <span class="font-semibold">
                        {{ row.groupingValue }}
                      </span>

                      <span> ({{ row.subRows.length }} transactions) </span>
                    </div>

                    <NumberFlow
                      :value="row.getValue('amount')"
                      :format="{
                        style: 'currency',
                        signDisplay: 'exceptZero',
                        currency: 'MYR',
                        trailingZeroDisplay: 'stripIfInteger',
                      }"
                    />
                  </div>
                </TableCell>
              </TableRow>
              <!-- Data Rows for the Group -->
              <template v-for="subRow in row.subRows" :key="subRow.id">
                <TableRow :data-state="subRow.getIsSelected() && 'selected'">
                  <TableCell
                    v-for="cell in subRow.getVisibleCells()"
                    :key="cell.id"
                  >
                    <FlexRender
                      :render="cell.column.columnDef.cell"
                      :props="cell.getContext()"
                    />
                  </TableCell>
                </TableRow>
              </template>
            </template>
          </template>
          <!-- Ungrouped View -->
          <template v-else>
            <template v-if="table.getRowModel().rows?.length">
              <TableRow
                v-for="row in table.getRowModel().rows"
                :key="row.id"
                :data-state="row.getIsSelected() && 'selected'"
              >
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
            </template>
          </template>
          <!-- No Results Case -->
          <TableRow v-if="!table.getRowModel().rows?.length">
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <DataTablePagination :table="table" />
  </div>
</template>
