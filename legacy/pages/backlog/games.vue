<script setup>
import { ref } from 'vue'
import FloatButtonGroup from '~/components/common/FloatButtonGroup.vue';
import UnsplashlikeColumns from '~/components/common/UnsplashlikeColumns.vue';
import AddList from '~/components/backlog-games/AddList.vue';
import AddGame from '~/components/backlog-games/AddGame/index.vue';
import ListCard from '~/components/backlog-games/ListCard/index.vue';
import FilteredLists from '~/components/backlog-games/FilteredLists.vue';

const rawLists = ref([])

const loadLists = async () => {
  const res = await $fetch('/api/lists')
  rawLists.value = res.data
}

loadLists()

// group list-cards into columns
const customReducer = (columns, item, itemIndex, columnCount) => {
  const resultColumns = itemIndex === 0
    ? Array(columnCount).fill(null).map(() => [])
    : columns

  let shortestColumnIndex = 0

  for (let i = 1; i < resultColumns.length; i++) {
    const ITEM_PENALTY = 3 // to account for card header and footer heights
    const prev = resultColumns[shortestColumnIndex].reduce((sum, n) => ITEM_PENALTY + sum + n.items.length, 0)
    const curr = resultColumns[i].reduce((sum, n) => ITEM_PENALTY + sum + n.items.length, 0)

    if (curr < prev) {
      shortestColumnIndex = i
    }
  }

  resultColumns[shortestColumnIndex].push(item)

  return resultColumns
}
</script>

<template>
  <div class="max-w-[1200px] mx-auto p-6">
    <FilteredLists :lists="rawLists">
      <template v-slot="{ lists }">
        <UnsplashlikeColumns
          :items="lists"
          :customReducer="customReducer"
        >
          <template #renderItem="{ item }" :key="item.listId">
            <ListCard
              :listId="item.listId"
              :title="item.title"
              :items="item.items"
              :read-only="item.pseudo"
              @delete-success="loadLists"
              @update-success="loadLists"
              @create-item-success="loadLists"
            />
          </template>
        </UnsplashlikeColumns>
      </template>
    </FilteredLists>
  </div>

  <FloatButtonGroup>
    <AddGame
      @success="loadLists"
      @list-success="loadLists"
    />

    <AddList
      @success="loadLists"
    />
  </FloatButtonGroup>
</template>