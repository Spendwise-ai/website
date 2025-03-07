<template>
  <TransitionRoot as="template" :show="sidebarOpen">
    <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
      <TransitionChild
        as="template"
        enter="transition-opacity ease-linear duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-900/80" />
      </TransitionChild>

      <div class="fixed inset-0 flex">
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
            <TransitionChild
              as="template"
              enter="ease-in-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in-out duration-300"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div
                class="absolute top-0 left-full flex w-16 justify-center pt-5"
              >
                <button
                  type="button"
                  class="-m-2.5 p-2.5"
                  @click="sidebarOpen = false"
                >
                  <span class="sr-only">Close sidebar</span>
                  <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                </button>
              </div>
            </TransitionChild>
            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <div
              class="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4"
            >
              <div class="flex h-16 shrink-0 items-center">
                <img
                  class="h-8 w-auto"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white"
                  alt="Your Company"
                />
              </div>
              <nav class="flex flex-1 flex-col">
                <ul role="list" class="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" class="-mx-2 space-y-1">
                      <li v-for="item in navigation" :key="item.name">
                        <NuxtLink
                          :href="item.href"
                          :class="[
                            item.href == $route.path
                              ? 'bg-indigo-700 text-white'
                              : 'text-indigo-200 hover:bg-indigo-700 hover:text-white',
                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                          ]"
                        >
                          <component
                            :is="item.icon"
                            :class="[
                              item.current
                                ? 'text-white'
                                : 'text-indigo-200 group-hover:text-white',
                              'size-6 shrink-0',
                            ]"
                            aria-hidden="true"
                          />
                          {{ item.name }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div class="text-xs/6 font-semibold text-indigo-200">
                      Your Accounts
                    </div>

                    <ul role="list" class="-mx-2 mt-2 space-y-1">
                      <li v-for="account in accounts" :key="account.name">
                        {{ account }}
                        test
                        <NuxtLink
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
                        </NuxtLink>
                      </li>
                    </ul>
                  </li>
                  <li class="mt-auto">
                    <NuxtLink
                      href="#"
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
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
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
