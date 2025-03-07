<template>
  <div class="flex items-center">
    <input
      v-model="modelValue"
      type="number"
      name="price"
      id="price"
      class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
      placeholder="0.00"
    />

    <UInputMenu
      v-model="currency"
      :options="currencies"
      value-attribute="value"
      option-attribute="name"
      variant="none"
      class="w-46 p-0"
    />
  </div>
</template>

<script setup>
const [modelValue] = defineModel("modelValue", { default: 0 });
const [currency] = defineModel("currency", { default: "RM" });

const currencies = [
  {
    value: "USD",
    name: "USD",
  },
  {
    value: "RM",
    name: "RM",
  },
];
</script>
<style>
input[type="number"] {
  -moz-appearance: textfield;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
