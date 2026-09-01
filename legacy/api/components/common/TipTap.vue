<script setup>
  import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const model = defineModel();

const editor = useEditor({
  content: model.value,
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    model.value = editor.getHTML();
  },
  parseOptions: {
    preserveWhitespace: true,
  }
})

</script>

<template>
  <editor-content :editor="editor" />
</template>