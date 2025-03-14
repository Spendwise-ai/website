<script setup lang="ts">
import type { Table } from "@tanstack/vue-table";
import { cn } from "@/lib/utils";
import { computed } from "vue";
import { groups } from "../data/data";

// Define props with the table instance
interface DataTableGroupingSelectorProps {
  table: Table<any>;
}

const props = defineProps<DataTableGroupingSelectorProps>();

// Get all leaf columns (columns that can potentially be grouped)
const allColumns = computed(() => props.table.getAllLeafColumns());

// Get the current grouping state (array of column IDs in order)
const currentGrouping = computed(() => props.table.getState().grouping);
</script>

<template>
  <Popover>
    <!-- Trigger Button -->
    <PopoverTrigger as-child>
      <Button variant="outline" size="sm" class="h-8 border-dashed">
        <Icon name="i-radix-icons-group" class="mr-2 h-4 w-4" />
        Group by
        <template v-if="currentGrouping.length > 0">
          <Separator orientation="vertical" class="mx-2 h-4" />
          <!-- Show count on small screens -->
          <Badge
            variant="secondary"
            class="rounded-sm px-1 font-normal lg:hidden"
          >
            {{ currentGrouping.length }}
          </Badge>
          <!-- Show column names or count on larger screens -->
          <div class="hidden lg:flex space-x-1">
            <Badge
              v-if="currentGrouping.length > 2"
              variant="secondary"
              class="rounded-sm px-1 font-normal"
            >
              {{ currentGrouping.length }} columns
            </Badge>
            <template v-else>
              <Badge
                v-for="colId in currentGrouping"
                :key="colId"
                variant="secondary"
                class="rounded-sm px-1 font-normal"
              >
                {{
                  groups
                    .filter((g) => currentGrouping.includes(g.value))
                    .map((g) => g.label)
                    .join(",")
                }}
              </Badge>
            </template>
          </div>
        </template>
      </Button>
    </PopoverTrigger>

    <!-- Popover Content -->
    <PopoverContent class="w-[200px] p-0" align="start">
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="group in groups"
              :key="group.value"
              :value="group.value"
              @select="
                () => {
                  const isGrouped = currentGrouping.includes(group.value);
                  if (isGrouped) {
                    // Remove column from grouping
                    props.table.setGrouping(
                      currentGrouping.filter((id) => id !== group.value),
                    );
                  } else {
                    // Add column to the end of grouping
                    props.table.setGrouping([...currentGrouping, group.value]);
                  }
                }
              "
            >
              <!-- Checkbox Indicator -->
              <div
                :class="
                  cn(
                    'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                    currentGrouping.includes(group.value)
                      ? 'bg-primary text-primary-foreground'
                      : 'opacity-50 [&_svg]:invisible',
                  )
                "
              >
                <Icon name="i-radix-icons-check" :class="cn('h-4 w-4')" />
              </div>
              <!-- Column Label -->
              <!-- Grouping Order Indicator -->
              <div class="flex items-center gap-1.5">
                <Icon :name="group.icon" />
                {{ group.label }}
              </div>

              <span
                v-if="currentGrouping.includes(group.value)"
                class="ml-auto text-xs font-mono"
              >
                {{ currentGrouping.indexOf(group.value) + 1 }}
              </span>
            </CommandItem>
          </CommandGroup>

          <!-- Clear Grouping Option -->
          <template v-if="currentGrouping.length > 0">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                :value="{ label: 'Clear grouping' }"
                class="justify-center text-center"
                @select="() => props.table.setGrouping([])"
              >
                Clear grouping
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
