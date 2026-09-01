<script setup>
import { ref, reactive, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core'
import OpenLibrary from '@/client/openLibrary';
import { ChevronsUpDown } from 'lucide-vue-next'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Button
} from '@/components/ui/button'

let lastFetchId = 0;

const state = reactive({
  data: [],
  fetching: false,
});

const getFirstAuthorName = (work) => {
  return work.author_name?.[0]
}

const getLabel = (work) => {
  let label = work.title

  const subtitle = work.subtitle
  const authorName = getFirstAuthorName(work)
  const year = work.first_publish_year

  if (subtitle) label += `: ${subtitle}`
  if (authorName) label += ` - ${authorName}`
  if (year) label += ` (${year})`

  return label
}

const fetchWorks = (searchKey) => {
  lastFetchId += 1;
  const fetchId = lastFetchId;
  state.data = [];
  state.fetching = true;

  OpenLibrary.search(searchKey)
    .then((res) => {
      if (fetchId !== lastFetchId) {
        // for fetch callback order
        return;
      }

      const data = res.docs.map((work) => ({
        data: work,
        label: getLabel(work),
        value: work.key,
      }));

      state.data = data
      state.fetching = false
    })
};

const debouncedFetchWorks = useDebounceFn(fetchWorks, 800)

const model = defineModel()
watch(() => model.value, () => {
  state.data = []
  state.fetching = false
});


const buttonLabel = computed(() => {
  return model.value?.label || 'Select work'
})

const open = ref(false)
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        class="w-full justify-between"
      >
        {{ buttonLabel }}
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-[590px] p-0">
      <Command
        :filterFunction="(list) => list"
        @update:searchTerm="debouncedFetchWorks"
      > 
        <CommandInput
          class="h-9"
          placeholder="Search..."
        />
        <CommandEmpty v-if="state.fetching">loading...</CommandEmpty>
        <CommandEmpty v-else>Nothing found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="option in state.data"
              :key="option.value"
              :value="option.value"
              @select="(ev) => {
                const found = state.data.find((d) => d.value === ev.detail.value)

                model = found
                open = false
              }"
            >
              {{ option.label }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
