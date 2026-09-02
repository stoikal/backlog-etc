<script setup lang="ts">
const allPlaylists = ref<any[]>([])
const page = ref(1)
const limit = 10
const hasMore = ref(true)
const loading = ref(false)
const sentinel = ref<HTMLElement | null>(null)

const columns = 3

const columnsData = computed(() => {
  const cols: (typeof allPlaylists.value)[] = Array.from({ length: columns }, () => [])
  allPlaylists.value.forEach((item, i) => cols[i % columns].push(item))
  return cols
})

async function loadPlaylists() {
  if (loading.value || !hasMore.value) return
  loading.value = true
  try {
    const { $api } = useNuxtApp()
    const res = await $api.get('/api/gaming/playlists', {
      params: { page: page.value, limit, sortBy: 'finished', sortDir: 'desc' }
    })
    allPlaylists.value.push(...res.data)
    hasMore.value = page.value < res.pagination.total_pages
    page.value++
  } finally {
    loading.value = false
  }
}

let observer: IntersectionObserver | null = null

onMounted(async () => {
  await loadPlaylists()
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) loadPlaylists()
  }, { rootMargin: '200px' })
  if (sentinel.value) observer.observe(sentinel.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <UPage>
    <UPageBody>
      <div v-if="allPlaylists.length" class="flex gap-4 mt-4">
        <div v-for="(col, ci) in columnsData" :key="ci" class="flex-1 space-y-4 min-w-0">
          <UCard v-for="list in col" :key="list.id" :title="list.title">
            <ul v-if="list.items?.length" class="space-y-2">
              <li v-for="item in list.items" :key="item.name" class="flex items-center gap-2">
                <UCheckbox :model-value="item.status === 'finished'" disabled />
                <span :class="item.status === 'finished' && 'line-through text-muted'">{{ item.name }}</span>
              </li>
            </ul>
            <p v-else class="text-sm text-muted">No items</p>
          </UCard>
        </div>
      </div>

      <div v-if="loading" class="text-center text-muted mt-4">Loading...</div>

      <div ref="sentinel" class="h-4" />
    </UPageBody>
  </UPage>
</template>

