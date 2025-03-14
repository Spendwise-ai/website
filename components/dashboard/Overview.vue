<script setup lang="ts">
import { format, parseISO } from "date-fns";

const client = useSupabaseClient();
const { data: transactions } = await useAsyncData(
  "transactions",
  async () => {
    const { data } = await client
      .from("transaction_total_by_month")
      .select("month, total");
    if (!data) return [];
    const formatted = data.map((d) => ({
      ...d,
      month: d.month && format(d.month, "MMM"),
    }));
    return formatted;
  },
  { default: () => [] },
);
</script>

<template>
  <BarChart
    :data="transactions"
    :categories="['total']"
    index="month"
    :rounded-corners="4"
  />
</template>
