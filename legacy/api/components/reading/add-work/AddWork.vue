<script setup>
import { BookOpen } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import AddWorkForm from './AddWorkForm.vue'

const emit = defineEmits(['success', 'listSuccess'])

const isDialogOpen = ref(false)
</script>

<template>
  <Dialog
    v-model:open="isDialogOpen"
  >
    <DialogTrigger as-child>
      <Button
        size="icon"
        class="rounded-full drop-shadow-md"
      >
        <BookOpen />
      </Button>
    </DialogTrigger>
    <DialogContent class="w-[40rem] max-w-none">
      <DialogHeader>
        <DialogTitle>Add Work</DialogTitle>
      </DialogHeader>

      <AddWorkForm
        @close="isDialogOpen = false"
        @success="emit('success')"
        @list-success="emit('listSuccess')"
      />
    </DialogContent>
  </Dialog>
</template>