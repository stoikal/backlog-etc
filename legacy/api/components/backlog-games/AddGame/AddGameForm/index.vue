<script setup>
import { Button } from '@/components/ui/button'
import GameSelect from '@/components/common/GameSelect.vue';
import PlatformSelect from '@/components/common/PlatformSelect.vue';
import AddListForm from './AddListForm.vue';
import CheckboxGroup from '@/components/common/CheckboxGroup.vue';

const emit = defineEmits(['success', 'listSuccess', 'close'])

const lists = ref([])

const loadLists = async () => {
  const res = await $fetch('/api/lists')
  lists.value = res.data
}

loadLists()

const checkboxOptions = computed(() => {
  return lists.value
    .filter((list) => !list.pseudo)
    .map((list) => ({
      label: list.title,
      value: list.listId
    }))
})

const selectedGame = ref(null)
const listsContainingSelectedGame = ref([])
const selectedLists = ref([])

watch(() => selectedGame.value?.value, (gameId) => {
  if (gameId) {
    $fetch(`/api/lists/by-game/${gameId}`)
      .then((res) => {
        if (res.data) {
          const listIds = res.data.map((list) => list.listId)
          selectedLists.value = listIds
          listsContainingSelectedGame.value = listIds
        }
      })
  }
})

const handleListSuccess = () => {
  loadLists()
  emit('listSuccess')
}

const listItemsToCreate = computed(() => {
  const gameId = selectedGame.value?.value

  return selectedLists.value
    .filter((list) => !listsContainingSelectedGame.value.includes(list))
    .map((listId) => ({
      listId,
      gameId,
    }))
})

const listIdsToDelete = computed(() => {
  return listsContainingSelectedGame.value
    .filter((list) => !selectedLists.value.includes(list))
})

const save = async () => {
  const gameId = selectedGame.value?.value
  
  if (gameId) {
    const game = selectedGame.value.data

    await $fetch('/api/games', {
      method: 'POST',
      body: game
    })
    
    if (listItemsToCreate.value.length) {
      await $fetch('/api/list-items', {
        method: 'POST',
        body: {
          listItems: listItemsToCreate.value
        }
      })
    }

    if (listIdsToDelete.value.length) {
      await $fetch(`/api/list-items/by-game/${gameId}`, {
        method: 'DELETE',
        body: {
          listIds: listIdsToDelete.value
        }
      })
    }

    emit('success')

    selectedGame.value = null
    listsContainingSelectedGame.value = []
    selectedLists.value = []
  }
}

const saveAndClose = async () => {
  await save()
  emit('close')
}

const getGenres = (game = {}) => {
  return game.genres
    ?.map((item) => item.name)
    .join(', ')
}

const getPlatforms = (game = {}) => {
  return game.platforms
    ?.map((item) => item.name)
    .join(', ')
}

const getReleaseDate = (game = {}) => {
  if (!game.firstReleaseDate) return ''

  return new Date(game.firstReleaseDate * 1000)
    .toISOString().slice(0, 10);
}

const selectedPlatform = ref(null)

const isSubmitDisabled = computed(() => {
  const isChanged = listItemsToCreate.value.length > 0 || listIdsToDelete.value.length > 0
  return (
    selectedGame.value === null ||
    !isChanged
  )
})
</script>

<template>
  <div class="flex gap-4 mb-4 pt-6">
    <div class="w-3/4">
      <div class="mb-6">
        <div class="mb-3">
          <GameSelect
            v-model="selectedGame"
            :platform="selectedPlatform"
            size="large"
          />
        </div>
  
        <div class="space-y-1">
          <div>
            {{ getGenres(selectedGame?.data) }}
          </div>
          <div>
            {{ getPlatforms(selectedGame?.data) }}
          </div>
          <div>
            {{ getReleaseDate(selectedGame?.data) }}
          </div>
        </div>
      </div>

      <CheckboxGroup
        v-model="selectedLists"
        :options="checkboxOptions"
        class="mb-4"
      />

      <AddListForm
        @success="handleListSuccess"
      />
    </div>
    <div class="w-1/4">
      <PlatformSelect
        v-model="selectedPlatform"
        size="large"
        style="width: 100%"
      />
    </div>
  </div>

  <div class="text-end space-x-3">
    <Button
      variant="outline"
      :disabled="isSubmitDisabled"
      @click="save"
    >
      Save
    </Button>
    <Button
      :disabled="isSubmitDisabled"
      @click="saveAndClose"
    >
      Save and Close
    </Button>
  </div>
</template>