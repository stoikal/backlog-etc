<template>
  <div class="flex flex-1">
    <USidebar
      variant="sidebar"
      collapsible="icon"
      :open="true"
    >
      <template #header>
        <UIcon name="i-lucide-house" class="size-8" />
      </template>
      <UNavigationMenu
        orientation="vertical"
        :ui="{ link: 'p-1.5 overflow-hidden' }"
        :items="[
          { label: 'Home', to: '/', icon: 'i-lucide-house' },
          { label: 'Gaming', to: '/gaming/playlists', icon: 'i-lucide-chess-pawn' },
        ]"
      />
    </USidebar>

    <div
      class="flex-1 flex flex-col overflow-hidden lg:peer-data-[variant=floating]:my-4 peer-data-[variant=inset]:m-4 lg:peer-data-[variant=inset]:not-peer-data-[collapsible=offcanvas]:ms-0 peer-data-[variant=inset]:rounded-xl peer-data-[variant=inset]:shadow-sm peer-data-[variant=inset]:ring peer-data-[variant=inset]:ring-default bg-default"
    >
      <div
        class="h-(--ui-header-height) shrink-0 flex items-center px-4"
        :class="[
          'border-b border-default',
        ]"
      >
        <!-- <UButton
          :icon="side === 'left' ? 'i-lucide-panel-left' : 'i-lucide-panel-right'"
          color="neutral"
          variant="ghost"
          aria-label="Toggle sidebar"
          @click="open = !open"
        /> -->
      </div>

      <div class="flex-1 p-4">
        <UContainer>
          <slot />
        </UContainer>
      </div>
    </div>
  </div>
</template>