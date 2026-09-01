<script setup>
import { Trash } from 'lucide-vue-next';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import EditListButton from './EditListButton.vue'
import AddListItemForm from './AddListItemForm.vue'
import ListCardItem from './ListCardItem/index.vue'
import GameComment from "./GameComment/index.vue"

const props = defineProps({
  listId: String,
  title: String,
  items: Array,
  readOnly: Boolean,
})

const emit = defineEmits(['deleteSuccess', 'updateSuccess', 'createItemSuccess'])

const handleDeleteList = async () => {
  await $fetch(`/api/lists/${props.listId}`, { method: 'DELETE' })

  isDeleteConfirmOpen.value = false
  emit('deleteSuccess')
}

const handleStatusCheckboxChange = async (item, checked) => {
  await $fetch('/api/list-items/update-status', {
    method: 'PUT',
    body: {
      gameId: item.gameId,
      isFinished: checked,
    }
  })

  emit('updateSuccess')
}

const sortedItems = computed(() => {
  const sorted = props.items
    .sort((a, b) => {
      // finished items last
      if (!a.isFinished && b.isFinished) return -1
      if (a.isFinished && !b.isFinished) return 1

      // if finished statuses are the same then sort alphabetically
      if (a.gameTitle < b.gameTitle) return -1
      if (a.gameTitle > b.gameTitle) return 1

      return 0
    })

  return sorted
})

const displayedItems = computed(() => {
  return sortedItems.value
})

const isDeleteConfirmOpen = ref(false)
</script>

<template>
  <Card class="mb-6">
    <CardHeader class="border-b flex-row justify-between items-center">
      <CardTitle class="text-md">
        {{ props.title }}
      </CardTitle>

      <div class="space-x-2" v-if="!props.readOnly">
        <EditListButton
          :list-id="props.listId"
          :list-title="props.title"
          :list-items="sortedItems"
          @update-success="emit('updateSuccess')"
        />
        <Popover v-model:open="isDeleteConfirmOpen">
          <PopoverTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="rounded-full w-8 h-8"
            >
              <Trash class="text-red-900 w-4 h-4"/>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div>
              <p>
                Delete?
              </p>
              <div class="text-end space-x-4">
                <Button variant="outline" @click="isDeleteConfirmOpen = false">No</Button>
                <Button @click="handleDeleteList">Yes</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </CardHeader>

    <CardContent class="p-0">
      <template v-for="item in displayedItems" :key="item.gameId">
        <div class="px-6 py-3 border- items-center flex gap-x-2 justify-between">
          <div class="items-center flex gap-x-2">
            <Checkbox
              :checked="item.isFinished"
              class="h-3 w-3"
              @update:checked="handleStatusCheckboxChange(item, $event)"
            />

            <ListCardItem
              :isFinished="item.isFinished"
              :gameTitle="item.gameTitle"
              :gameId="item.gameId"
              @success="emit('updateSuccess')"
            />
          </div>
          <div>
            <GameComment
              :gameId="item.gameId"
              :gameTitle="item.gameTitle"
              :isCommented="item.isCommented"
            />
          </div>
        </div>
      </template>
    </CardContent>

    <CardFooter class="justify-center pt-2 pb-4">
      <AddListItemForm
        v-if="!props.readOnly"
        :list-id="props.listId"
        @success="emit('createItemSuccess')"
      />
    </CardFooter>
  </Card>
</template>
