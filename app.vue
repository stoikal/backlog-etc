<script setup>
import { LogOut } from 'lucide-vue-next';
import Button from '@/components/ui/button/Button.vue';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
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
</script>

<template> 
  <header class="border-b">
    <div class="flex items-center justify-between min-h-20">
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
                      class="block p-3 space-y-1 leading-none no-underline transition-colors rounded-md outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div class="text-sm font-medium leading-none">Reading</div>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink
                      to="/backlog/games"
                      class="block p-3 space-y-1 leading-none no-underline transition-colors rounded-md outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
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
        <div class="p-4 px-6 text-end">
          <Button
            class="rounded-full"
            size="icon"
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
