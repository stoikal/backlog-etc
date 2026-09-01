<script setup>
import { ref } from 'vue'
import CheckboxGroup from '@/components/common/CheckboxGroup.vue';

const props = defineProps({
  gameId: Number,
})

const emit = defineEmits(['success'])

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

const selectedLists = ref([]);
const listsContainingGame = ref([]);

const loadSelectedLists = async () => {
  const res = await $fetch(`/api/lists/by-game/${props.gameId}`)
  
  const listIds = res.data.map((list) => list.listId)
  selectedLists.value = listIds
  listsContainingGame.value = listIds
}

loadSelectedLists()

const game = ref({});

const loadGame = async () => {
  const res = await $fetch(`/api/games/${props.gameId}`)
  game.value = res.data
}

loadGame()

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

const save = async () => {
  const listItemsToCreate = selectedLists.value
    .filter((list) => !listsContainingGame.value.includes(list))
    .map((listId) => ({
      listId,
      gameId: props.gameId,
    }))

  const listIdsToDelete = listsContainingGame.value
    .filter((list) => !selectedLists.value.includes(list))
  
  if (listItemsToCreate.length) {
    await $fetch('/api/list-items', {
      method: 'POST',
      body: {
        listItems: listItemsToCreate
      }
    })
  }

  if (listIdsToDelete.length) {
    await $fetch(`/api/list-items/by-game/${props.gameId}`, {
      method: 'DELETE',
      body: {
        listIds: listIdsToDelete
      }
    })
  }

  emit('success')
}
</script>

<template>
  <div class="mb-3 space-y-1">
    <h2 style="margin-bottom: 0;">
      <strong>
        {{ game.name }}
      </strong>
    </h2>
    <div>
      {{ getGenres(game) }}
    </div>
    <div>
      {{ getPlatforms(game) }}
    </div>
    <div>
      {{ getReleaseDate(game) }}
    </div>
  </div>

  <div class="mb-4">
    <CheckboxGroup
      v-model="selectedLists"
      :options="checkboxOptions"
    />
  </div>

  <div class="text-end">
    <Button
      @click="save"
    >
      Save
    </Button>
  </div>
</template>