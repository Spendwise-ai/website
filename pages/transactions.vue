<script setup lang="ts">
import { columns } from "@/components/tasks/components/columns"
import DataTable from "@/components/tasks/components/DataTable.vue"

const client = useSupabaseClient()
const { data: transactions } = await useAsyncData("transactions", async () => {
  const { data } = await client
    .from("transactions")
    .select(
      "*, sender:sender_id(*), recipient:recipient_id(*), category:category_id(*)",
    )
    .order("date", { ascending: true })
    .order("created_at", { ascending: false })
  return data
})
</script>

<template>
  <div class="w-full flex flex-col items-stretch gap-4">
    <div class="flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          Transactions
        </h2>

        <div class="bg-red-400" />
        <p class="text-muted-foreground">
          Here&apos;s a list of your transactions for this month!
        </p>
      </div>
    </div>
    <DataTable :data="transactions" :columns="columns" />
  </div>
</template>

<style scoped></style>
