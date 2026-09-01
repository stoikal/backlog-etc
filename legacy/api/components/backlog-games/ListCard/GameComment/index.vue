<script setup>
import { MessageCircle, MessageCircleMore } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import GameCommentForm from './GameCommentForm.vue';

const props = defineProps({
  gameId: Number,
  gameTitle: String,
  isCommented: Boolean,
})

const isDialogOpen = ref(false);
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        class="rounded-full w-8 h-8"
      > 
        <MessageCircleMore v-if="props.isCommented" class="text-zinc-500 w-4 h-4 "/>
        <MessageCircle v-else class="text-zinc-500 w-4 h-4" />
      </Button>

    </DialogTrigger>
    <DialogContent>
      <DialogHeader class="mb-4">
        <DialogTitle>{{ props.gameTitle }}</DialogTitle>
      </DialogHeader>

      <GameCommentForm
        :gameId="props.gameId"
        @success="isDialogOpen = false"
      />
    </DialogContent>
  </Dialog>
</template>
