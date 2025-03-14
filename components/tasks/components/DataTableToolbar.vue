<script setup lang="ts">
import type { Table } from "@tanstack/vue-table";
import type { Task } from "../data/schema";
import { computed } from "vue";
import { priorities, statuses, types } from "../data/data";
import DataTableFacetedFilter from "./DataTableFacetedFilter.vue";
import DataTableViewOptions from "./DataTableViewOptions.vue";
import AddTransactionSheet from "./AddTransactionSheet.vue";
import DataTableFacetedGroupBy from "./DataTableFacetedGroupBy.vue";

interface DataTableToolbarProps {
  table: Table<Task>;
}

const props = defineProps<DataTableToolbarProps>();

const isFiltered = computed(
  () => props.table.getState().columnFilters.length > 0,
);

const addTransactionModal = ref(false);
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 items-center space-x-2">
      <Input
        placeholder="Filter Transactions..."
        :model-value="
          (table.getColumn('name')?.getFilterValue() as string) ?? ''
        "
        class="h-8 w-[150px] lg:w-[250px]"
        @input="table.getColumn('name')?.setFilterValue($event.target.value)"
      />
      <DataTableFacetedFilter
        v-if="table.getColumn('type')"
        :column="table.getColumn('type')"
        title="Type"
        :options="types"
      />

      <DataTableFacetedGroupBy :table="table" />

      <Button
        v-if="isFiltered"
        variant="ghost"
        class="h-8 px-2 lg:px-3"
        @click="table.resetColumnFilters()"
      >
        Reset
        <Icon name="i-radix-icons-cross-2" class="ml-2 h-4 w-4" />
      </Button>
    </div>

    <div class="flex items-center space-x-2 flex-">
      <AddTransactionSheet />
      <DataTableViewOptions :table="table" />
    </div>
  </div>
</template>
