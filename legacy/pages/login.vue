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


const formState = ref({
  email: 'user@example.com',
  password: 'user'
})

const handleSubmit = async () => {
  const { email, password } = formState.value
  
  alert(email)
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
          class="space-y-6 text-end"
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