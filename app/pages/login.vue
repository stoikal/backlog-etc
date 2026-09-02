<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({ layout: false })

const toast = useToast()

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'Enter your email',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password',
  required: true
}]

const schema = z.object({
  email: z.string('Email is required').email('Invalid email'),
  password: z.string('Password is required').min(6, 'Must be at least 6 characters')
})

type Schema = z.output<typeof schema>

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('Login form submitted:', event.data)
  toast.add({
    title: 'Form submitted (mock)',
    description: `Email: ${event.data.email}`,
    color: 'success'
  })
}
</script>

<template>
  <UContainer>
    <div class="flex flex-col items-center justify-center min-h-screen">
      <UCard class="w-full max-w-md">
        <UAuthForm
          :schema="schema"
          :fields="fields"
          title="Login"
          icon="i-lucide-user"
          @submit="onSubmit"
        />
      </UCard>
    </div>
  </UContainer>
</template>