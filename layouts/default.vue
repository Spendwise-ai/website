<template>
  <!--
    This example requires updating your template:

    ```
    <html class="h-full bg-gray-100">
    <body class="h-full">
    ```
  -->
  <div class="min-h-full dark:bg-slate-800">
    <Header />
    <main class="-mt-24 pb-8">
      <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 class="sr-only">Page title</h1>
        <!-- Main 3 column grid -->
        <div
          class="bg-white dark:bg-slate-800 rounded-md p-6 border border-gray-200 dark:border-slate-700 shadow-sm"
        >
          <slot />
        </div>
      </div>
    </main>
    <footer>
      <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div
          class="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left"
        >
          <span class="block sm:inline">&copy; 2021 Your Company, Inc.</span>
          <span class="block sm:inline">All rights reserved.</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup></script>
