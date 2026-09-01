<script setup>
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import Week from './Week.vue';

dayjs.extend(weekOfYear);

const currentWeek = dayjs().week();

const activeTab = ref(currentWeek);

const weeks = new Array(54)
  .fill(null)
  .map((_, index) => index + 1);

</script>

<template>
  <div>
    <Tabs :defaultValue="currentWeek">
      <div class="flex justify-center bg-muted">
        <ScrollArea>
          <ScrollBar orientation="horizontal" />
          <TabsList>
            <template v-for="weekNum in weeks" :key="weekNum">
              <TabsTrigger :value="weekNum">
                {{ weekNum }}
              </TabsTrigger>
            </template>
          </TabsList>
        </ScrollArea>
      </div>
  
      <div class="max-w-[1000px] mx-auto p-6">
        <template v-for="weekNum in weeks" :key="weekNum">
          <TabsContent :value="weekNum">
            <Week
              :weekNum="weekNum"
            />
          </TabsContent>
        </template>
      </div>
    </Tabs>
  </div>
</template>