<script setup>
import { Button } from '@/components/ui/button'
import LitWorkSelect from '@/components/common/LitWorkSelect.vue';
import CheckboxGroup from '@/components/common/CheckboxGroup.vue';

const emit = defineEmits(['success', 'listSuccess', 'close'])

const lists = ref([])

const loadLists = async () => {
  const res = await $fetch('/api/reading/lists')
  lists.value = res.data
}

loadLists()

const checkboxOptions = computed(() => {
  return lists.value
    .map((list) => ({
      label: list.title,
      value: list.listId
    }))
})

const selectedWork = ref(null)
const selectedListIds = ref([])
const listsContainingWork = ref([])

const loadListsContainingWork = async (work) => {
  const workKey = encodeURIComponent(work.key)
  const res = await $fetch(`/api/reading/lists/by-work/${workKey}`)
  listsContainingWork.value = res.data
  selectedListIds.value = res.data.map((list) => list.listId)
}

watch(selectedWork, (selectedWork) => {
  if (selectedWork) {
    loadListsContainingWork(selectedWork.data)
  }
})

const listIdsToCreate = computed(() => {
  return selectedListIds.value
    .filter((id) => !listsContainingWork.value.some((list) => list.listId === id))
})

const listIdsToDelete = computed(() => {
  return listsContainingWork.value
    .filter((list) => !selectedListIds.value.includes(list.listId))
    .map((list) => list.listId)
})

const save = async () => {
  const workKey = selectedWork.value?.value
  
  if (workKey) {
    const rawData = selectedWork.value.data

    const body = {
      key: rawData.key,
      title: rawData.title,
      alternativeTitle: rawData.alternative_title,
      subtitle: rawData.subtitle,
      alternativeSubtitle: rawData.alternative_subtitle,
      firstPublishYear: rawData.first_publish_year,
      type: rawData.type,
      numberOfPagesMedian: rawData.number_of_pages_median,
      authors: rawData.author_key.map((key, index) => ({
        key,
        name: rawData.author_name[index]
      })),
      languages: rawData.language,
    }

    await $fetch('/api/reading/works', {
      method: 'POST',
      body
    })
    
    if (listIdsToCreate.value.length) {
      await $fetch(`/api/reading/works/${encodeURIComponent(workKey)}/items`, {
        method: 'POST',
        body: {
          listIds: listIdsToCreate.value
        }
      })
    }

    if (listIdsToDelete.value.length) {
      await $fetch(`/api/reading/works/${encodeURIComponent(workKey)}/items`, {
        method: 'DELETE',
        body: {
          listIds: listIdsToDelete.value
        }
      })
    }

    emit('success')

    selectedWork.value = null
    selectedListIds.value = []
  }
}

const saveAndClose = async () => {
  await save()
  emit('close')
}

const isSubmitDisabled = computed(() => {
  const isChanged = listIdsToCreate.value.length > 0 || listIdsToDelete.value.length > 0
  return (
    selectedWork.value === null ||
    !isChanged
  )
})
</script>

<template>
  <div class="pt-6 mb-6">
    <div class="mb-6">
      <LitWorkSelect
        v-model="selectedWork"
      />
    </div>

    <CheckboxGroup
      v-model="selectedListIds"
      :options="checkboxOptions"
    />
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