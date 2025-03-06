<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Tables } from "~/types/database.types";

const client = useSupabaseClient();

const [selected] = defineModel<Tables<"entity"> | null>("modelValue", {}); // Only a single label selected, not an array

const options = ref<Tables<"entity">[]>([]); // For storing the fetched options

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
  get: () => selected.value,
  set: async (label: Tables<"entity">) => {
    if (label.id) {
      selected.value = label;
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
        selected.value = data;
        options.value.push(data); // Add new label to options
      }
    }
  },
});

const loading = ref(false);

async function search(q: string) {
  loading.value = true;

  const { data } = await client.from("entity").select().ilike("name", `%${q}%`);

  loading.value = false;

  return data;
}

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
    :searchable="search"
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
