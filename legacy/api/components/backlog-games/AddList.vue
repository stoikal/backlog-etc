<script setup>
import { File } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const emit = defineEmits(['success'])

const isDialogOpen = ref(false)

const listTitle = ref("")

const save = async () => {
  await $fetch('/api/lists', {
    method: 'POST',
    body: {
      title: listTitle.value
    }
  })

  isDialogOpen.value = false
  listTitle.value = "";
  emit('success')
}
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <Button
        size="icon"
        class="rounded-full drop-shadow-md"
      >
        <File />
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add List</DialogTitle>
      </DialogHeader>

      <form class="pt-6" @submit.prevent="save">
        <div class="mb-6">
          <Label class="block mb-4">Title</Label>
          <Input v-model="listTitle" />
        </div>
        
        <div class="text-end">
          <Button
            :disabled="!listTitle.length"
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>