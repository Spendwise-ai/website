<template>
  <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
    <!-- Sidebar component, swap this element with another sidebar if you like -->
    <div
      class="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4"
    >
      <div class="flex h-16 shrink-0 items-center text-white opacity-90 gap-1">
        <img class="h-8 w-auto" src="~assets/img/logo.svg" alt="Your Company" />
        <h1 class="text-3xl font-bold text-white">SpendWyze</h1>
      </div>
      <nav class="flex flex-1 flex-col">
        <ul role="list" class="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" class="-mx-2 space-y-1">
              <li v-for="item in navigation" :key="item.name">
                <a
                  :href="item.href"
                  :class="[
                    item.href == $route.path
                      ? 'bg-indigo-700 text-white'
                      : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                    'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                  ]"
                >
                  <Icon
                    :name="item.icon"
                    :class="[
                      item.current
                        ? 'text-white'
                        : 'text-indigo-200 group-hover:text-white',
                      'size-6 shrink-0',
                    ]"
                    aria-hidden="true"
                  />
                  {{ item.name }}
                </a>
              </li>
            </ul>
          </li>
          <li>
            <div class="text-xs/6 font-semibold text-indigo-200">
              Your Accounts
            </div>
            {{ accounts }}
            <ul role="list" class="-mx-2 mt-2 space-y-1">
              <li v-for="account in accounts" :key="account.name">
                Test
                <a
                  :href="account.href"
                  :class="[
                    account.current
                      ? 'bg-indigo-700 text-white'
                      : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                    'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                  ]"
                >
                  <span
                    class="flex size-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white"
                    >{{ account.initial }}</span
                  >
                  <span class="truncate">{{ account.name }}</span>
                </a>
              </li>
            </ul>
          </li>
          <li class="mt-auto">
            <NuxtLink
              href="/settings"
              class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-indigo-200 hover:bg-indigo-700 hover:text-white"
            >
              <Icon
                name="lucide:settings"
                class="size-6 shrink-0 text-indigo-200 group-hover:text-white"
                aria-hidden="true"
              />
              Settings
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: "lucide:layout-dashboard",
  },

  {
    name: "Transactions",
    href: "/transactions",
    icon: "tdesign:undertake-transaction",
  },
];

const { data: accounts } = await useAsyncData("accounts", async () => {
  const { data } = await client.from("entity").select();
  console.log("test", data);
  return data;
});

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

const sidebarOpen = ref(false);
</script>
