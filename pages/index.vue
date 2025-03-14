<script setup lang="ts">
import { CalendarDate } from "@internationalized/date";
import NumberFlow from "@number-flow/vue";
import type { Table } from "@tanstack/vue-table";
import { Activity, CreditCard, DollarSign, Users } from "lucide-vue-next";

const dataCard = ref({
  currentBalance: 0,
  currentBalanceDesc: 0,
  expenses: 0,
  expensesDesc: 0,
  income: 0,
  incomeDesc: 0,
  owed: 0,
  owedDesc: 0,
});

const client = useSupabaseClient();

const transactions = ref<any[]>([]);
const dateRange = ref({
  start: new CalendarDate(2025, 0, 20),
  end: new CalendarDate(2025, 0, 20).add({ days: 20 }),
});

watchDeep(
  dateRange,
  async (newDateRange) => {
    if (!newDateRange.start || !newDateRange.end) return;
    const { data, error } = await client
      .from("transactions")
      .select("*, sender:sender_id(*),recipient:recipient_id(*)")
      .filter("date", "gte", newDateRange.start.toString())
      .filter("date", "lt", newDateRange.end.toString());
    console.log(data);
    transactions.value = data;
    const sum = transactions.value.reduce((n, { amount }) => n + amount, 0);

    console.log(sum);
    dataCard.value = {
      currentBalance: sum,
      currentBalanceDesc: 20.1 / 100,
      expenses: 2350,
      expensesDesc: 180.5 / 100,
      income: 12234,
      incomeDesc: 45 / 100,
      owed: 573,
      owedDesc: 201,
    };
  },
  { immediate: true },
);
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-2xl font-bold tracking-tight">Dashboard</h2>
      <div class="flex items-center space-x-2">
        <BaseDateRangePicker v-model="dateRange" />
        <Button>Download</Button>
      </div>
    </div>
    <main class="flex flex-1 flex-col gap-4 md:gap-8">
      <div class="grid gap-4 lg:grid-cols-4 md:grid-cols-2 md:gap-8">
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between pb-2 space-y-0"
          >
            <CardTitle class="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <NumberFlow
                :value="dataCard.currentBalance"
                :format="{
                  style: 'currency',
                  currency: 'MYR',
                  trailingZeroDisplay: 'stripIfInteger',
                }"
              />
            </div>
            <p class="text-xs text-muted-foreground">
              <NumberFlow
                :value="dataCard.currentBalanceDesc"
                prefix="+"
                :format="{ style: 'percent', minimumFractionDigits: 1 }"
              />
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between pb-2 space-y-0"
          >
            <CardTitle class="text-sm font-medium"> Expenses </CardTitle>
            <Users class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <NumberFlow
                :value="dataCard.expenses"
                :format="{
                  style: 'currency',
                  currency: 'MYR',
                  trailingZeroDisplay: 'stripIfInteger',
                }"
              />
            </div>
            <p class="text-xs text-muted-foreground">
              <NumberFlow
                :value="dataCard.expensesDesc"
                prefix="+"
                :format="{ style: 'percent', minimumFractionDigits: 1 }"
              />
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between pb-2 space-y-0"
          >
            <CardTitle class="text-sm font-medium"> Income </CardTitle>
            <CreditCard class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <NumberFlow
                :value="dataCard.income"
                :format="{
                  style: 'currency',
                  currency: 'MYR',
                  trailingZeroDisplay: 'stripIfInteger',
                }"
              />
            </div>
            <p class="text-xs text-muted-foreground">
              <NumberFlow
                :value="dataCard.incomeDesc"
                prefix="+"
                :format="{ style: 'percent', minimumFractionDigits: 1 }"
              />
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between pb-2 space-y-0"
          >
            <CardTitle class="text-sm font-medium">Owed</CardTitle>
            <Activity class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              <NumberFlow
                :value="dataCard.owed"
                :format="{
                  style: 'currency',
                  currency: 'MYR',
                  trailingZeroDisplay: 'stripIfInteger',
                }"
              />
            </div>
            <p class="text-xs text-muted-foreground">
              <NumberFlow :value="dataCard.owedDesc" prefix="+" /> since last
              hour
            </p>
          </CardContent>
        </Card>
      </div>
      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 md:gap-8">
        <Card class="xl:col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent class="pl-2">
            <DashboardOverview />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-8">
            <div
              v-for="(transaction, idx) in transactions.slice(0, 5)"
              :key="idx"
              class="flex items-center gap-4"
            >
              <img
                src="/public/bank-logo/maybank.png"
                class="hidden h-8 w-8 sm:block"
              />
              <div class="grid gap-1">
                <p class="text-sm font-medium leading-none">
                  {{ transaction.sender.name }}
                  {{ transaction.recipient.name }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ transaction.date }} .
                  <span class="capitalize">
                    {{ transaction.type }}
                  </span>
                </p>
              </div>
              <div class="ml-auto font-medium">
                <NumberFlow
                  :value="transaction.amount"
                  :format="{
                    style: 'currency',
                    currency: 'USD',
                    trailingZeroDisplay: 'stripIfInteger',
                  }"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>
