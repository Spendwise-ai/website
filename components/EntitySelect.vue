<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Tables } from "~/types/database.types";

const client = useSupabaseClient();

const [selected] = defineModel<number>("modelValue", {}); // Only a single label selected, not an array

const [options] = defineModel("options", { default: [] });

// Fetch the label options from Supabase
onMounted(async () => {
  const { data, error } = await client
    .from("entity") // Replace with your actual table name
    .select("*") // Select all columns you need
    .order("name", { ascending: true }); // Optional, you can order by 'name'

  if (error) {
    console.error("Error fetching labels:", error);
  } else {
    options.value = data || [];
  }
});

// Handle the label selection
const label = computed({
  get: () => options.value?.find((option) => option.id == selected.value),
  set: async (label: Tables<"entity">) => {
    console.log("label", label);
    if (label.id) {
      selected.value = label.id;
    } else {
      // Handle creating a new label if it doesn't exist (only if creatable option is used)
      const { data, error } = await client
        .from("entity") // Replace with your actual table name
        .insert([
          { name: label.name, color: generateColorFromString(label.name) },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating label:", error);
      } else {
        selected.value = data.id;
        options.value.push(data); // Add new label to options
      }
    }
  },
});

const loading = ref(false);

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i: number): string {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();
  return "00000".substring(0, 6 - c.length) + c;
}

function generateColorFromString(str: string): string {
  return intToRGB(hashCode(str));
}
</script>

<template>
  <USelectMenu
    v-model="label"
    by="id"
    name="label"
    required="true"
    option-attribute="name"
    searchable-lazy
    searchable
    :options="options"
    creatable
    variant="none"
  >
    <template #label>
      <template v-if="label">
        <span class="flex items-center -space-x-1">
          <span
            v-if="label"
            class="flex-shrink-0 w-2 h-2 mt-px rounded-full"
            :style="{ background: `#${label.color}` }"
          />
        </span>
        <span>{{ label.name }}</span>
      </template>
      <template v-else>
        <span class="text-gray-500 dark:text-gray-400 truncate"
          >Select label</span
        >
      </template>
    </template>

    <template #option="{ option }">
      <span
        class="flex-shrink-0 w-2 h-2 mt-px rounded-full"
        :style="{ background: `#${option.color}` }"
      />
      <span class="truncate">{{ option.name }}</span>
    </template>

    <template #option-create="{ option }">
      <span class="flex-shrink-0">New label:</span>
      <span
        class="flex-shrink-0 w-2 h-2 mt-px rounded-full -mx-1"
        :style="{ background: `#${generateColorFromString(option.name)}` }"
      />
      <span class="block truncate">{{ option.name }}</span>
    </template>
  </USelectMenu>
</template>
