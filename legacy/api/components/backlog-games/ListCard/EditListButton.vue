<script setup>
import { ref } from 'vue';
import { Pencil, Trash } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

const emit = defineEmits(['updateSuccess'])

const props = defineProps({
  listId: String,
  listTitle: String,
  listItems: Array,
})

const isDialogOpen = ref(false)

const titleEdit = ref('')
const listItemsEdit = ref([])

const openModal = () => {
  titleEdit.value = props.listTitle
  listItemsEdit.value = props.listItems
}

const tempDeleteItem = (item) => {
  listItemsEdit.value = listItemsEdit.value.filter(i => i !== item)
}

// TODO add confirmation
const submitEdit = async () => {
  const gameToDelete = props.listItems
    .filter((item) => listItemsEdit.value.every((i) => i.gameId !== item.gameId))

  if (gameToDelete.length) {
    const message = `Delete ${gameToDelete.map(i => i.gameTitle).join(', ')}?`
    const confirmed = confirm(message) // FIXME

    if (confirmed) {
      await $fetch(`/api/list-items/by-list/${props.listId}`, {
        method: 'DELETE',
        body: {
          gameIds: gameToDelete.map(i => i.gameId)
        }
      })
    } else {
      return
    }
  }

  await $fetch(`/api/lists/${props.listId}`, {
    method: 'PUT',
    body: {
      title: titleEdit.value
    }
  })

  isDialogOpen.value = false
  emit('updateSuccess')
}
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogTrigger as-child>
      <Button
        size="icon"
        variant="ghost"
        class="rounded-full w-8 h-8"
        @click="openModal"
      >
        <Pencil class="text-zinc-500 w-4 h-4"/>
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader class="mb-4">
        <DialogTitle>Edit</DialogTitle>
      </DialogHeader>

      <div class="flex items-center gap-4">
        <Label class="block mb-2">Title:</Label>
        <Input v-model="titleEdit" />
      </div>

      <ScrollArea class="h-[600px]" style="max-height: calc(100vh - 200px);">
        <ul>
          <template v-for="item in listItemsEdit" :key="item.gameId">
            <li class="flex justify-between items-center border-b py-3">
              <div>{{ item.gameTitle }}</div>
              <Button
                size="icon"
                variant="ghost"
                class="rounded-full"
                @click="tempDeleteItem(item)"
              >
                <Trash class="w-5 h-5 text-red-900"/>
              </Button>
            </li>
          </template>
        </ul>
      </ScrollArea>

      <DialogFooter>
        <Button
          variant="outline"
          @click="isDialogOpen = false"
        >
          Cancel
        </Button>
        <Button
          @click="submitEdit"
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>