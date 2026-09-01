<script setup>
import { Gamepad2 } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import AddGameForm from './AddGameForm/index.vue'

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
        <Gamepad2 />
      </Button>
    </DialogTrigger>
    <DialogContent class="w-[60rem] max-w-none">
      <DialogHeader>
        <DialogTitle>Add Game</DialogTitle>
      </DialogHeader>

      <AddGameForm
        @close="isDialogOpen = false"
        @success="emit('success')"
        @list-success="emit('listSuccess')"
      />
    </DialogContent>
  </Dialog>
</template>