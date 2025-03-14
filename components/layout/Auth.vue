<script setup lang="ts">
defineProps<{
  reverse?: boolean;
}>();
</script>

<template>
  <div
    class="relative flex items-center justify-center px-4 h-dvh lg:max-w-none lg:px-0"
    :class="{ 'flex-row-reverse': reverse }"
  >
    <div
      class="relative hidden h-full flex-1 flex-col bg-muted p-10 text-white lg:flex dark:border-r"
    >
      <div class="absolute inset-0 bg-zinc-900" />
      <div class="relative z-20 flex items-center text-lg font-bold">
        <img src="/favicon.svg" class="w-8" alt="" />
        SpendWyze
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            &ldquo;SpendWyze has helped monitor my spending, plan my budgets and
            keep track of where my money goes, all in one easy-to-use app. It's
            been a life-saver. me deliver stunning designs to my clients faster
            &rdquo;
          </p>
          <footer class="text-sm">Soultan Toure</footer>
        </blockquote>
      </div>
    </div>
    <div class="mx-auto flex-1 lg:p-8">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
