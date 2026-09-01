<script setup>
import { ref } from "vue";
import ListCardItemForm from "./ListCardItemForm.vue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const props = defineProps({
  gameId: Number,
  gameTitle: String,
  isFinished: Boolean,
})

const emit = defineEmits(['success'])

const isDialogOpen = ref(false)

const handleSuccess = () => {
  isDialogOpen.value = false;
  emit('success');
}
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <span role="button" class="text-sm">
        <s v-if="props.isFinished">{{ props.gameTitle }}</s>
        <span v-else>{{ props.gameTitle }}</span>
      </span>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader class="mb-4">
        <DialogTitle>Edit Game</DialogTitle>
      </DialogHeader>

      <ListCardItemForm
        :gameId="props.gameId"
        @success="handleSuccess"
      />
    </DialogContent>
  </Dialog>
</template>