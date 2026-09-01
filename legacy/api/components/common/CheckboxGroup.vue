<script setup>
import { Checkbox } from '@/components/ui/checkbox'

const props = defineProps({
  options: Array
})

const model = defineModel()

const isChecked = (option) => {
  return model.value?.includes(option.value)
}

const handleCheckboxChange = (option, checked) => {
  if (checked) {
    model.value =[...model.value, option.value]
  } else {
    model.value = model.value.filter((i) => i !== option.value)
  }
}

</script>

<template>
  <div class="flex flex-wrap gap-y-2 gap-x-4">
    <template v-for="option in props.options" :key="option.value">
      <label class="items-center flex gap-x-2 cursor-pointer">
        <Checkbox
          :checked="isChecked(option)"
          @update:checked="handleCheckboxChange(option, $event)"
        />
        <span>{{ option.label }}</span>
        
      </label>
    </template>
  </div>
</template>