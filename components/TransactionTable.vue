<script setup lang="ts">
import { type TablesInsert } from "~/types/database.types";

const columns = [
  {
    key: "id",
    label: "ID",
  },
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

const { data: entities } = await useAsyncData("entities", async () => {
  const { data } = await client.from("entity").select();
  return data;
});

const { data: transactions } = await useAsyncData("transactions", async () => {
  const { data } = await client
    .from("transactions")
    .select("*")
    .order("date", { ascending: true })
    .order("created_at", { ascending: true });
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
  const { data, error } = await client
    .from("transactions")
    .delete()
    .eq("id", transaction.id);
  console.error(error);
  transactions.value = transactions.value.filter(
    (t) => t.id !== transaction.id,
  );
}

const baseTransaction = {
  name: "",
  sender: null,
  recipient: null,
  currency: "RM",
  amount: 0,
  date: null,
};
const form = ref<TablesInsert<"transactions">>(baseTransaction);
const loading = ref(false);
async function createTransaction(transaction) {
  loading.value = true;
  const { data } = await client
    .from("transactions")
    .insert(transaction)
    .select("*")
    .single();
  transactions.value.push(data);
  form.value = transaction;

  loading.value = false;
}

const groupBy = ref();
import { format } from "date-fns";
</script>

<template>
  <div>
    <div class="flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  v-for="(column, idx) in columns"
                  scope="col"
                  class="py-3.5 text-left text-sm font-semibold whitespace-nowrap text-gray-900 sticky top-0 z-10 border-b border-gray-300 bg-white/75 py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 backdrop-blur-sm backdrop-filter sm:pl-6 lg:pl-8"
                  :class="{
                    'pr-3 pl-4 sm:pl-0': idx == 0,
                    'px-2': idx != 0,
                  }"
                >
                  {{ column.label }}
                </th>
                <th
                  scope="col"
                  class="relative py-3.5 pr-4 pl-3 whitespace-nowrap sm:pr-0"
                >
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr class="border-t border-gray-200" v-if="groupBy">
                <th
                  colspan="5"
                  scope="colgroup"
                  class="bg-gray-50 py-2 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                >
                  {{ groupBy }}
                </th>
              </tr>
              <tr
                v-for="{ id, ...transaction } in transactions"
                :key="transaction.id"
                class="divide-x divide-gray-200"
              >
                <td class="text-sm whitespace-nowrap text-gray-500 sm:pl-0">
                  {{ transaction.id }}
                </td>
                <td
                  class="px-2 -my-2 text-sm font-medium whitespace-nowrap text-gray-500"
                >
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <button type="button" class="flex items-center gap-1">
                      <Icon
                        name="lucide:calendar"
                        class="text-indigo-500"
                        mode="svg"
                      />
                      <span class="">
                        {{ format(transaction.date, "dd-MM-yyy") }}
                      </span>
                    </button>

                    <template #panel="{ close }">
                      <DatePicker
                        v-model="transaction.date"
                        is-required
                        @close="close"
                      />
                    </template>
                  </UPopover>
                </td>
                <td class="px-2 -my-2 text-sm whitespace-nowrap text-gray-500">
                  <EntitySelect
                    v-model:options="entities"
                    v-model="transaction.sender"
                    @update:model-value="
                      updateTransaction({ id, sender: $event })
                    "
                  />
                </td>
                <td class="px-2 -my-2 text-sm whitespace-nowrap text-gray-500">
                  <EntitySelect
                    v-model:options="entities"
                    v-model="transaction.recipient"
                    @update:model-value="
                      updateTransaction({ id, recipient: $event })
                    "
                  />
                </td>
                <td
                  class="px-2 -my-2 text-sm whitespace-nowrap text-gray-500 max-w-32"
                >
                  <MoneyInput
                    v-model="transaction.amount"
                    v-model:currency="transaction.currency"
                  />
                </td>
                <td
                  class="relative pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0"
                >
                  <UDropdown :items="items({ id, ...transaction })">
                    <UButton
                      color="gray"
                      variant="ghost"
                      icon="i-heroicons-ellipsis-horizontal-20-solid"
                    />
                  </UDropdown>
                </td>
              </tr>

              <tr class="divide-x divide-gray-200">
                <td
                  class="text-sm whitespace-nowrap text-gray-500 sm:pl-0"
                ></td>
                <td
                  class="px-2 text-sm font-medium whitespace-nowrap text-gray-500 flex items-center py-1.5"
                >
                  <UPopover :popper="{ placement: 'bottom-start' }">
                    <button type="button" class="flex items-center gap-1">
                      <Icon
                        name="lucide:calendar"
                        class="text-indigo-500"
                        mode="svg"
                      />
                      <span class="">
                        {{ format(form.date, "dd-MM-yyy") }}
                      </span>
                    </button>

                    <template #panel="{ close }">
                      <DatePicker
                        v-model="form.date"
                        is-required
                        @close="close"
                      />
                    </template>
                  </UPopover>
                </td>
                <td class="px-2 -my-2 text-sm whitespace-nowrap text-gray-900">
                  <EntitySelect v-model="form.sender" />
                </td>
                <td class="px-2 -my-2 text-sm whitespace-nowrap text-gray-500">
                  <EntitySelect v-model="form.recipient" />
                </td>
                <td
                  class="px-2 -my-2 text-sm whitespace-nowrap text-gray-500 max-w-32"
                >
                  <MoneyInput
                    v-model="form.amount"
                    v-model:currency="form.currency"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    class="rounded-sm bg-indigo-50 text-xs font-semibold text-indigo-600 shadow-xs hover:bg-indigo-100 flex w-full h-full items-center justify-center py-2.5 -mt-px -ml-px -mr-1"
                    @click="createTransaction(form)"
                  >
                    Create
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
