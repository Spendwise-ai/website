<script setup lang="ts">
import { format } from "date-fns";

const date = ref(new Date());
</script>

<template>
  <UPopover :popper="{ placement: 'bottom-start' }">
    <button
      type="button"
      class="rounded-full bg-white px-2.5 py-1 text-sm text-gray-500 ring-1 shadow-xs ring-gray-300/80 ring-inset hover:bg-gray-50 flex items-center gap-1"
    >
      <Icon name="lucide:calendar" class="text-indigo-400" />
      <span class="mt-px">
        {{ format(date, "d MMM, yyy") }}
      </span>
    </button>

    <template #panel="{ close }">
      <DatePicker v-model="date" is-required @close="close" />
    </template>
  </UPopover>
</template>
