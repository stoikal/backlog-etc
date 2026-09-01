<script setup>
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const props = defineProps({
  gameId: Number,
})

const emit = defineEmits('success')

const comment = ref('')

const load = async () => {
  const res = await $fetch(`/api/games/comment/${props.gameId}`);
  comment.value = res.data.comment;
}

load();

const save = async () => {
  const res = await $fetch(`/api/games/comment/${props.gameId}`, {
    method: 'POST',
    body: {
      comment: comment.value,
    }
  });

  emit('success')
}
</script>

<template>
  <form @submit.prevent="save" class="space-y-6 text-end">
    <Textarea
      v-model="comment"
      rows="10"
    />
  
    <Button
      type="submit"
    >
      Save
    </Button>
  </form>
</template>