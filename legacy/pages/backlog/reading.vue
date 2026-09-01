<script setup>
import { ref } from 'vue';
import FloatButtonGroup from '@/components/common/FloatButtonGroup.vue';
import AddList from '@/components/reading/AddList.vue';
import AddWork from '@/components/reading/add-work/AddWork.vue';
import ListCard from '@/components/reading/list-card/ListCard.vue';
import UnsplashlikeColumns from '@/components/common/UnsplashlikeColumns.vue';
import FilteredLists from '~/components/reading/FilteredLists.vue';

const rawLists = ref([])

const loadLists = async () => {
  const res = await $fetch('/api/reading/lists')
  rawLists.value = res.data
}

loadLists()
</script>

<template>
  <div class="max-w-[1200px] mx-auto p-6">
    <FilteredLists :lists="rawLists">
      <template v-slot="{ lists }">
        <UnsplashlikeColumns
          :items="lists"
          :customReducer="(columns, item, itemIndex, columnCount) => {
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
          }"
        >
          <template #renderItem="{ item }" :key="item.listId">
            <ListCard
              :title="item.title"
              :items="item.items"
              class="mb-6"
              @update-success="loadLists"
            />
          </template>
        </UnsplashlikeColumns>
      </template>
    </FilteredLists>
  </div>

  <FloatButtonGroup>
    <AddWork
      @success="loadLists"
      @list-success="loadLists"
    />
    
    <AddList
      @success="loadLists"
    />
  </FloatButtonGroup>
</template>
