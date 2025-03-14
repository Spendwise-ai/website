<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import type { Task } from "../data/schema";
import { computed } from "vue";
import { labels } from "../data/data";
import { taskSchema } from "../data/schema";
import { types } from "../data/data";
import { toast } from "vue-sonner";

interface DataTableRowActionsProps {
  row: Row<Task>;
}
const props = defineProps<DataTableRowActionsProps>();

const task = computed(() => taskSchema.parse(props.row.original));

const client = useSupabaseClient();
const deleteTask = async (transaction: Task) => {
  console.log(transaction);
  const { data, error } = await client
    .from("transactions")
    .delete()
    .eq("id", transaction.id);
  if (error) {
    toast("Error deleting transaction");
  } else {
    toast("Successfully deleted transaction");
  }
};
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
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup :value="task.type">
            <DropdownMenuRadioItem
              v-for="label in types"
              :key="label.value"
              :value="label.value"
            >
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
