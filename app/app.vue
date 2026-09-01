<template>
  <div>
    <!-- The <NuxtRouteAnnouncer> component adds a hidden element with the page title to announce route changes to assistive technologies. -->
    <NuxtRouteAnnouncer />
    
    <NuxtLayout>
      <!-- use pages.  Every file in the app/pages/ directory represents a different route displaying its content. -->
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
