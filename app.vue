<script setup>
import { LogOut } from 'lucide-vue-next';
import Button from '@/components/ui/button/Button.vue';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

useHead({
  title: 'Backlog',
  meta: [
    { name: 'description', content: 'Backlog' }
  ],
  bodyAttrs: {
    class: 'dark',
  },
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const logoutAndRedirect = async () => {
  await supabase.auth.signOut();
  navigateTo({ path: '/login' })
}
</script>

<template> 
  <header class="border-b">
    <div class="flex justify-between items-center min-h-20">
      <div class="px-6" v-if="user">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger open>Backlog</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul class="w-[200px] p-4">
                  <li>
                    <NuxtLink
                      to="/backlog/reading"
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div class="text-sm font-medium leading-none">Reading</div>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      to="/backlog/games"
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div class="text-sm font-medium leading-none">Games</div>
                    </NuxtLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NuxtLink to="/weekly" :class="navigationMenuTriggerStyle()">
                Weekly
              </NuxtLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <template v-if="user">
        <div class="text-end p-4 px-6">
          <Button
            class="rounded-full"
            size="icon"
            @click="logoutAndRedirect"
          >
            <LogOut />
          </Button>
        </div>
      </template>
    </div>
  </header>
  <div>
    <main>
      <NuxtPage />
    </main>
  </div>
</template>
