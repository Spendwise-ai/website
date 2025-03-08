<template>
  <div>
    <!-- Static sidebar for desktop -->
    <SideBar />
    <MobileHeader v-model:sidebar-open="sideBarOpen" />
    <div class="lg:pl-72">
      <main class="h-screen overflow-scroll">
        <DesktopHeader
          v-model:side-bar-open="sideBarOpen"
          class="h-16 sticky top-0"
        />
        <UModal v-model="commandPromptOpen">
          <CommandPrompt />
        </UModal>

        <div class="px-4 sm:px-6 lg:px-8 sticky top-20">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const commandPromptOpen = ref(false);
const sideBarOpen = ref(false);
</script>
