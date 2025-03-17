<script setup lang="ts">
const [open] = defineModel("open", { default: false });

const close = () => {
  open.value = false;
};
</script>
<template>
  <Sheet v-model:open="open">
    <SheetTrigger as-child>
      <slot name="trigger">
        <Button class="h-8 px-4 pr-3 lg:px-3">
          Add
          <Icon name="i-radix-icons-plus" class="ml-2 h-4 w-4" />
        </Button>
      </slot>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>
          <slot name="title"> Add Transaction </slot>
        </SheetTitle>
        <SheetDescription>
          <slot name="description">
            Add the details for the transaction here. Click Create when you're
            done.
          </slot>
        </SheetDescription>
      </SheetHeader>
      <slot :close="close"></slot>
    </SheetContent>
  </Sheet>
</template>
