<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { useMapControls } from "~/stores/map-controls-store";
import { useSettings } from "~/stores/settings-store";

const settings = useSettings();
const controls = useMapControls();

</script>

<template>
    <div class="
        absolute top-0 flex z-10 w-full
        sm:w-auto
        sm:top-4 sm:justify-center sm:self-center 
    ">
        <div class="
            flex justify-center items-center flex-shrink-0 w-full
            p-4
            rounded border shadow-2xl
            bg-white
        ">
            <div class="hidden sm:flex items-center space-x-4">
                <TRCSelect label="Demographic Metric" :options="controls.demographicMetricOptions" v-model="controls.currentDemographicMetric" />
                <!-- <TRCSelect :options="controls.demographicMetricOptions" v-model="controls.currentDemographicMetric" /> -->
                <!-- <span class="font-semibold">for</span> -->
                <TRCSelect label="Eviction Metric" :options="controls.evictionMetricOptions" v-model="controls.currentEvictionMetric" />
                <!-- <TRCSelect :options="controls.evictionMetricOptions" v-model="controls.currentEvictionMetric" /> -->
                <!-- <span class="font-semibold">and</span> -->
                <TRCSelect label="Region" :options="controls.sourceOptions" v-model="controls.currentSource" />
                <!-- <TRCSelect :options="controls.sourceOptions" v-model="controls.currentSource" /> -->
                <!-- <span class="font-semibold">in</span> -->
                <TRCSelect label="Year" :options="controls.yearOptions" v-model="controls.currentYear" />
                <!-- <TRCSelect :options="controls.yearOptions" v-model="controls.currentYear" /> -->
                
                <!-- <span>|</span>
                <TRCButton @click="settings.showDialog = true">
                    <IconGear />
                </TRCButton> -->
            </div>

            <div class="sm:hidden flex flex-col w-full space-y-2">
                <Popover class="relative">
                    <PopoverButton class="">
                        Map Filters
                    </PopoverButton>
                    <Transition
                        enterActiveClass="transition duration-200 ease-out"
                        enterFromClass="translate-y-1 opacity-0"
                        enterToClass="translate-y-0 opacity-100"
                        leaveActiveClass="transition duration-150 ease-in"
                        leaveFromClass="translate-y-0 opacity-100"
                        leaveToClass="translate-y-1 opacity-0"
                    >
                        <PopoverPanel
                            class="absolute z-10  max-w-sm bg-white rounded border p-4 transform "
                        >
                            <div>
                                <TRCSelect label="Eviction Metric" :options="controls.evictionMetricOptions" v-model="controls.currentEvictionMetric" />
                                <TRCSelect label="Demographic Metric" :options="controls.demographicMetricOptions" v-model="controls.currentDemographicMetric" />
                                <TRCSelect label="Region" :options="controls.sourceOptions" v-model="controls.currentSource" />
                                <TRCSelect label="Year" :options="controls.yearOptions" v-model="controls.currentYear" />
                            </div>
                        </PopoverPanel>
                    </Transition>
                </Popover>
            </div>
        </div>
    </div>
</template>
