<script setup>
import { Save, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const emit = defineEmits(['success'])

const isFormOpen = ref(false)

const listTitle = ref('')

const saveList = async () => {
  await $fetch('/api/lists', {
    method: 'POST',
    body: {
      title: listTitle.value
    }
  })

  emit('success')
  listTitle.value = ''
  isFormOpen.value = false
}
</script>

<template>
  <template v-if="isFormOpen">
    <div class="flex space-x-2">
      <Input v-model="listTitle" class="w-30"/>
      <Button
        size="icon"
        @click="saveList"
      >
        <Save />
      </Button>
      <Button
        variant="outline"
        size="icon"
        @click="isFormOpen = false"
      >
        <X />
      </Button>
    </div>
  </template>
  <template v-else>
    <Button
      variant="link"
      @click="isFormOpen = true"
    >
      + list
    </Button>
  </template>
</template>