<script setup lang="ts">
import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-vue-next";
import { ref } from "vue";

const client = useSupabaseClient();

const { data: entities } = await useAsyncData("entities", async () => {
  const { data } = await client.from("entity").select("*");
  return data;
});

const open = ref(false);
const [value] = defineModel("modelValue", { required: true });
const selected = computed({
  set: (id: number) => {
    value.value = id;
  },
  get: () => entities.value?.find((entity) => entity.id === value.value),
});
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-full justify-between"
      >
        {{ selected ? selected.name : "Select entity..." }}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[225px] p-0">
      <Command v-model="selected">
        <CommandInput placeholder="Search entity..." />
        <CommandEmpty>No entity found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="entity in entities"
              :key="entity.id"
              :value="entity.id"
              @select="open = false"
            >
              <Check
                :class="
                  cn(
                    'mr-2 h-4 w-4',
                    value === entity.id ? 'opacity-100' : 'opacity-0',
                  )
                "
              />
              {{ entity.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
