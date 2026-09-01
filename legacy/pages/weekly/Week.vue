<script setup>
import { useDebounceFn } from '@vueuse/core'
import { Badge } from '@/components/ui/badge'
import TipTap from '~/components/common/TipTap.vue';

const props = defineProps({
  weekNum: Number,
})

const debouncedFn = useDebounceFn((v) => {
  $fetch('/api/weekly/notes', {
    method: "POST",
    body: {
      weekId: Number(`2024${props.weekNum}`),
      content: v
    }
  })
}, 800)


const content = ref('')

watch(content, (v) => {
  debouncedFn(v)
})

const loaded = ref(false)

const load = async () => {
  const res = await $fetch(`/api/weekly/notes`, {
    params: {
      weekId: `2024${props.weekNum}`
    }
  })
  loaded.value = true;
  content.value = res.data.content;
}

load()
</script>

<template>
  <div>
    <Badge>Week {{ props.weekNum }}</Badge>
    <br />
    <br />
    <template v-if="loaded">
      <TipTap v-model="content" class="border" />
    </template>
  </div>
</template>