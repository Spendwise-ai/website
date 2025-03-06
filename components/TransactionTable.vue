<script setup lang="ts">
import { type TablesInsert } from "~/types/database.types";

const columns = [
  {
    key: "date",
    label: "Date",
  },
  {
    key: "sender",
    label: "Sender",
  },

  {
    key: "recipient",
    label: "Recipient",
  },

  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "actions",
  },
];

const client = useSupabaseClient();

const { data: transactions } = await useAsyncData("transactions", async () => {
  const { data } = await client
    .from("transactions")
    .select("*, sender(*), recipient(*)")
    .order("date", { ascending: true })
    .order("created_at", { ascending: true });
  console.log(data);
  return data;
});

const items = (row: TablesInsert<"transactions">) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => console.log("Edit", row.id),
    },
    {
      label: "Duplicate",
      icon: "i-heroicons-document-duplicate-20-solid",
    },
  ],
  [
    {
      label: "Archive",
      icon: "i-heroicons-archive-box-20-solid",
    },
    {
      label: "Move",
      icon: "i-heroicons-arrow-right-circle-20-solid",
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => deleteTransaction(row),
    },
  ],
];
const q = ref("");

const filteredRows = computed(() => {
  if (!q.value) {
    return transactions.value;
  }

  return transactions.value.filter((t) => true);
});

async function updateTransaction(transaction: TablesInsert<"transactions">) {
  const { data } = await client
    .from("transactions")
    .update(transaction)
    .eq("id", transaction.id);
}

async function deleteTransaction(transaction) {
  console.log(transaction);
  const { data } = await client
    .from("transactions")
    .delete()
    .eq("id", transaction.id);
  transactions.value = transactions.filter((t) => t.id !== transaction.id);
}

const loading = ref(false);
async function createTransaction(transaction) {
  loading.value = true;
  const { data } = await client
    .from("transactions")
    .insert(transaction)
    .select("*, sender(*), recipient(*)")
    .single();
  transactions.value.push(data);

  loading.value = false;
}

const newTransaction: TablesInsert<"transactions"> = {
  name: "Test",
  sender: 26,
  recipient: 27,
  currency: "RM",
  amount: 10,
};
</script>

<template>
  <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
    <UInput v-model="q" placeholder="Search Transactions..." />
    <UButton
      @click="createTransaction(newTransaction)"
      :class="{ disabled: loading }"
    >
      Add Transaction
    </UButton>
  </div>
  <UTable
    :rows="filteredRows"
    :columns="columns"
    class="overflow-x-auto scrollbar-none"
  >
    <template #date-data="{ row, key, column, index }">
      <input
        :value="row[column.key]"
        type="date"
        @change="updateTransaction({ id: row.id, [column.key]: $event })"
      />
    </template>
    <template #amount-data="{ row, key, column, index }">
      <UInput
        placeholder="0.00"
        class="w-40"
        :model-value="row[column.key]"
        type="number"
        @update:model-value="
          updateTransaction({ id: row.id, [column.key]: $event })
        "
      >
        <template #trailing>
          <span class="text-gray-500 dark:text-gray-400 text-xs">RM</span>
        </template>
      </UInput>
    </template>

    <template #sender-data="{ row, column }">
      <EntitySelect
        v-model="row[column.key]"
        @update:model-value="
          updateTransaction({ id: row.id, [column.key]: $event.id })
        "
      />
    </template>

    <template #recipient-data="{ row, key, column, index }">
      <EntitySelect
        v-model="row[column.key]"
        @update:model-value="
          updateTransaction({ id: row.id, [column.key]: $event.id })
        "
      />
    </template>

    <template #actions-data="{ row }">
      <UDropdown :items="items(row)">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-ellipsis-horizontal-20-solid"
        />
      </UDropdown>
    </template>
  </UTable>
</template>
