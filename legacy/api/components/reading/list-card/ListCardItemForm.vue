<script setup>
import { ref } from 'vue'
import CheckboxGroup from '@/components/common/CheckboxGroup.vue'

const props = defineProps({
  workKey: String
})

const emit = defineEmits(['success'])

const work = ref({})

const loadWork = async () => {
  const workKey = encodeURIComponent(props.workKey)
  const res = await $fetch(`/api/reading/works/${workKey}`)

  work.value = res.data
}

loadWork()

const lists = ref([])

const loadLists = async () => {
  const res = await $fetch('/api/reading/lists')
  lists.value = res.data
}

loadLists()

const listsContainingWork = ref([])
const selectedListIds = ref([])

const loadListsContainingWork = async () => {
  const workKey = encodeURIComponent(props.workKey)
  const res = await $fetch(`/api/reading/lists/by-work/${workKey}`)
  listsContainingWork.value = res.data
  selectedListIds.value = res.data.map((list) => list.listId)
}

loadListsContainingWork()

const listIdsToCreate = computed(() => {
  return selectedListIds.value
    .filter((id) => !listsContainingWork.value.some((list) => list.listId === id))
})

const listIdsToDelete = computed(() => {
  return listsContainingWork.value
    .filter((list) => !selectedListIds.value.includes(list.listId))
    .map((list) => list.listId)
})

const checkboxOptions = computed(() => {
  return lists.value
    .map((list) => ({
      label: list.title,
      value: list.listId
    }))
})

const save = async () => {
  const workKey = encodeURIComponent(props.workKey)

  if (listIdsToCreate.value.length) {
    await $fetch(`/api/reading/works/${workKey}/items`, {
      method: 'POST',
      body: {
        listIds: listIdsToCreate.value
      }
    })
  }

  if (listIdsToDelete.value.length) {
    await $fetch(`/api/reading/works/${workKey}/items`, {
      method: 'DELETE',
      body: {
        listIds: listIdsToDelete.value
      }
    })
  }

  emit('success')
}

const getAuthors = (work) => {
  return work.authors
    ?.map((author) => author.name)
    .join(', ')
}

const getLanguages = (work) => {
  return work.languages
    ?.map((language) => language.name ?? language.key)
    .join(', ')
}

const isSubmitDisabled = computed(() => {
  const isChanged = listIdsToCreate.value.length > 0 || listIdsToDelete.value.length > 0
  return !isChanged
})
</script>

<template>
  <form @submit.prevent="save">
    <div class="mb-6 space-y-1">
      <h2>
        <strong>
          {{ work.title }}
        </strong>
      </h2>
      <div>
        {{ getAuthors(work) }}
      </div>
      <div>
        {{ work.firstPublishYear }}
      </div>
      <div>
        {{ getLanguages(work) }}
      </div>
    </div>

    <div class="mb-6">
      <CheckboxGroup
        v-model="selectedListIds"
        :options="checkboxOptions"
      />
    </div>

    <div class="text-end">
      <Button
        type="submit"
        :disabled="isSubmitDisabled"
      >
        Save
      </Button>
    </div>
  </form>
</template>
