<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  url: string;
}
const props = defineProps<Props>();
</script>
<template>
  <Dialog :open="!!url">
    <DialogContent class="p-1 overflow-clip">
      <iframe
        :src="url"
        frameborder="0"
        class="w-full"
        style="height: 40rem"
      ></iframe>
    </DialogContent>
  </Dialog>
</template>
