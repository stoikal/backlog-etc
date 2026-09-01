<script setup>
import { ref, reactive, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core'
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

const props = defineProps({
  size: String,
  platform: Number,
})

const searchKey = ref('')

const state = reactive({
  data: [],
  fetching: false,
});

const getReleaseYear = (game = {}) => {
  if (!game.firstReleaseDate) return 'N/A'

  return new Date(game.firstReleaseDate * 1000)
    .getFullYear()
}

const fetchGames = (name) => {
  lastFetchId += 1;
  const fetchId = lastFetchId;
  state.data = [];
  state.fetching = true;
  searchKey.value = name

  const params = {
    search: name,
  }

  if (props.platform) params.platform = props.platform

  $fetch('/api/games', { params })
    .then((res) => {
      if (fetchId !== lastFetchId) {
        // for fetch callback order
        return;
      }

      const data = res.data.map((game) => ({
        data: game,
        label: `${game.name} (${getReleaseYear(game)})`,
        value: game.id,
      }));

      state.data = data
      state.fetching = false
    });
};

const debouncedFetchGames = useDebounceFn(fetchGames, 800)

const model = defineModel()
watch(() => model.value, () => {
  state.data = []
  state.fetching = false
});

watch(() => props.platform, () => {
  debouncedFetchGames(searchKey.value)
})

const buttonLabel = computed(() => {
  return model.value?.label || 'Select game'
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
    <PopoverContent class="w-[670px] p-0">
      <Command
        :filterFunction="(list) => list"
        @update:searchTerm="debouncedFetchGames"
      > 
        <CommandInput
          class="h-9"
          placeholder="Search game..."
        />
        <CommandEmpty v-if="state.fetching">loading...</CommandEmpty>
        <CommandEmpty v-else>No game found.</CommandEmpty>
        <CommandList>
          <CommandGroup>
            <CommandItem
              v-for="game in state.data"
              :key="game.value"
              :value="game.value"
              @select="(ev) => {
                const found = state.data.find((d) => d.value === ev.detail.value)

                model = found
                open = false
              }"
            >
              {{ game.label }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
