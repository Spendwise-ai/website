<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import type { Task } from "../data/schema";
import { computed } from "vue";
import { taskSchema } from "../data/schema";
import { types } from "../data/data";
import { toast } from "vue-sonner";

interface DataTableRowActionsProps {
  row: Row<Tables<"transactions">>;
}
const props = defineProps<DataTableRowActionsProps>();

const task = computed(() => taskSchema.parse(props.row.original));

const client = useSupabaseClient();
const deleteTask = async (transaction: Task) => {
  console.log(transaction);
  const { data, error } = await client
    .from("transactions")
    .delete()
    .eq("id", transaction.id as number);
  if (error) {
    toast("Error deleting transaction");
  } else {
    toast("Successfully deleted transaction");
  }
};
import DataTableSheet from "./DataTableSheet.vue";
import TransactionForm from "./TransactionForm.vue";
import type { Tables } from "~/types/database.types";
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="h-8 w-8 flex p-0 data-[state=open]:bg-muted"
      >
        <Icon name="i-radix-icons-dots-horizontal" class="h-4 w-4" />
        <span class="sr-only">Open menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[160px]">
      <DataTableSheet>
        <template #trigger>
          <Button
            variant="ghost"
            class="text-normal rounded-sm w-full justify-start font-normal px-2.5"
            >Edit</Button
          >
        </template>

        <template #title> Edit Transaction </template>

        <template #description>Edit transaction</template>
        <template v-slot="{ close }">
          <TransactionForm edit :initial="row.original" @submit="close" />
        </template>
      </DataTableSheet>
      <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Types</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup :value="task.type">
            <DropdownMenuRadioItem
              v-for="label in types"
              :key="label.value"
              :value="label.value"
            >
              <component :is="label.icon" class="mr-1.5" />
              {{ label.label }}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="deleteTask(row.original)">
        Delete
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
