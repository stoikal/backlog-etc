<script setup>
import { ref } from 'vue'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

definePageMeta({ middleware: 'auth' })

const supabase = useSupabaseClient()

const formState = ref({
  email: 'user@example.com',
  password: 'user'
})

const handleSubmit = async () => {
  const { email, password } = formState.value
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (!error) {
    navigateTo({ path: '/' })
  }
}
</script>
<template>
  <div class="p-8">
    <Card class="w-[500px] max-w-full mx-auto">
      <CardHeader>
        <CardTitle>Log In</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          class="text-end space-y-6"
          @submit.prevent="handleSubmit"
        >
          <Input
            v-model="formState.email"
            id="login-email"
            placeholder="Email"
          />

          <Input
            v-model="formState.password"
            id="login-password"
            type="password"
            placeholder="Password"
          />

          <Button type="submit">
            Log In
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>