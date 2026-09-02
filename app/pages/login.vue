<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({ layout: false })

const toast = useToast()
const errorMessage = ref<string | null>(null)
const tokenCookie = useCookie('accessToken', {
  maxAge: 60 * 15,
  sameSite: 'lax',
  path: '/'
})

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

async function onSubmit(event: FormSubmitEvent<Schema>) {
  errorMessage.value = null
  try {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: event.data
    })
    tokenCookie.value = data.token
    toast.add({ title: 'Welcome!', description: `Logged in as ${data.username}`, color: 'success' })
    await navigateTo('/')
  } catch (err: any) {
    errorMessage.value = 'Invalid email or password'
  }
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
        >
          <template #validation>
            <UAlert v-if="errorMessage" color="error" icon="i-lucide-info" :title="errorMessage" />
          </template>
        </UAuthForm>
      </UCard>
    </div>
  </UContainer>
</template>