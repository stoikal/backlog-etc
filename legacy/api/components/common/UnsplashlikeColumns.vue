<script setup>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const props = defineProps({
  items: Array,
  customReducer: Function,
})

const breakpoints = useBreakpoints(breakpointsTailwind)
const columnCount = computed(() => {
  let count = 1

  if (breakpoints.greaterOrEqual('lg').value) {
    count = 3
  } else if (breakpoints.greaterOrEqual('sm').value) {
    count = 2
  }

  return count
})

const listsColumns = computed(() => {
  // example result: [[1, 4, 7], [2, 5], [3, 6]]
  const defaultReducer = (columns, item, itemIndex, columnCount) => {
    const columnIndex = itemIndex % columnCount

    if (columns[columnIndex]) {
      columns[columnIndex].push(item)
    } else {
      columns[columnIndex] = [item]
    }

    return columns
  }

  const columns = props.items.reduce((result, item, itemIndex) => {
    const reducer = typeof props.customReducer === 'function'
      ? props.customReducer
      : defaultReducer

    return reducer(result, item, itemIndex, columnCount.value)
  }, [])
  
  return columns
})
</script>

<template>
  <div class="flex gap-6">
    <template
      v-for="(col, index) in listsColumns"
      :key="index"
    >
      <div :class="columnCount === 3 ? 'w-1/3' : columnCount === 2 ? 'w-1/2' : 'w-full'">
        <template
          v-for="(item, itemIndex) in col"
          :key="itemIndex"
        >
          <slot name="renderItem" :item="item"></slot>
        </template>
      </div>
    </template>
  </div>
</template>