<script setup>
import { useDebounceFn } from '@vueuse/core'
import Input from '@/components/ui/input/Input.vue';
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps({
  lists: Array,
})

const gameTitleFilter = ref('')
const search = ref('')

const debouncedChangeSearchKey = useDebounceFn((value) => {
  search.value = value
}, 600)

watch(gameTitleFilter, (value) => {
  debouncedChangeSearchKey(value)
})

const filteredLists = computed(() => {
  const searchKey = search.value.toLowerCase()
  const isFilterEmpty = search.value.length === 0

  return props.lists
    .map((list) => ({
      ...list,
      items: list.items
        .filter((item) => {
          const gameTitle = item.gameTitle.toLowerCase()

          return isFilterEmpty || gameTitle.includes(searchKey)
        })
    }))
    .filter((list) => isFilterEmpty || list.items.length >  0)
})

const countFinished = (items) => {
  return items.filter((item) => item.isFinished).length
}

const sortByFinishedCount = (a, b) => {
  const finishedA = countFinished(a.items)
  const finishedB = countFinished(b.items)

  if (finishedA < finishedB) return -1
  if (finishedA > finishedB) return 1

  const unfinishedA = a.items.length - finishedA
  const unfinishedB = b.items.length - finishedB

  if (unfinishedA > unfinishedB) return -1
  if (unfinishedA < unfinishedB) return 1

  return 0
}

const sortAlphabetically = (a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1

const sortByCreatedDate = (a, b) => {
  const timeA = new Date(a.createdAt).getTime()
  const timeB = new Date(b.createdAt).getTime()

  if (timeA > timeB) return -1
  if (timeA < timeB) return 1
  return 0
}

const comparators = {
  alphabetical: sortAlphabetically,
  finished: sortByFinishedCount,
  created: sortByCreatedDate,
}

const sortBy = ref('finished')

const sortedLists = computed(() => {
  return [...filteredLists.value]
    .sort(comparators[sortBy.value])
})
</script>

<template>
  <div class="flex justify-between mb-8">
    <div class="flex-initial">
      <Input
        v-model="gameTitleFilter"
        placeholder="game title"
      />
    </div>
    <div class="flex items-center">
      <Label for="sort-select" class="mr-2 whitespace-nowrap">sort by:</Label>
      <Select
        v-model="sortBy"
        id="sort-select"
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="finished">
            finished count
          </SelectItem>
          <SelectItem value="created">
            created date
          </SelectItem>
          <SelectItem value="alphabetical">
            alphabetical order
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>

  <slot :lists="sortedLists"></slot>
</template>