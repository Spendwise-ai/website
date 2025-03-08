<template>
  <div>
    <div class="md:flex md:items-center md:justify-between pt-10 px-2">
      <div class="min-w-0 flex-1">
        <h2
          class="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
        >
          Transactions
        </h2>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <DateRangePicker />
      </div>
    </div>
    <div class="mt-4"></div>
    <TransactionTable />
  </div>
</template>
<script setup lang="ts"></script>
