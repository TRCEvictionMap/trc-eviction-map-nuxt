<script setup lang="ts">
import { useMapControls } from "~/stores/map-controls-store";

const interpolated = useInterpolatedValues();
const controls = useMapControls();


const demographicMetricName = computed(() =>
    controls.demographicMetricOptions.find(({ value }) => value === controls.currentDemographicMetric)?.text
);

const demographicStops = computed(() => Object.keys(interpolated[controls.currentDemographicMetric]))

const evictionMetric = computed(() =>
    controls.evictionMetricOptions.find(({ value }) => value === controls.currentEvictionMetric)?.text
);

</script>

<template>
    <div class="absolute bottom-4 self-center shadow-xl border rounded p-4 bg-white">

        <div class="space-y-4">
            <div v-if="controls.currentDemographicMetric !== 'none'">
                <h2 class="font-semibold">
                    {{ demographicMetricName }}
                </h2>
                <div>
                    <div
                        class="h-6 w-full"
                        :style="{
                            background: `linear-gradient(to right, ${interpolated.rgba(0.05)}, ${interpolated.rgba(0.5)})`
                        }"
                    ></div>
                    <div class="relative h-6 text-sm">
                        <div class="absolute left-[10%]">
                            <div class="h-1 border border-black w-[1px]"></div>
                            <div class="-translate-x-[50%]">
                                {{ demographicStops[0] }}
                            </div>
                        </div>
                        <div class="absolute left-[50%]">
                            <div class="h-1 border border-black w-[1px]"></div>
                            <div class="-translate-x-[50%]">
                                {{ demographicStops[1] }}
                            </div>
                        </div>
                        <div class="absolute left-[90%]">
                            <div class="h-1 border border-black w-[1px]"></div>
                            <div class="-translate-x-[50%]">
                                {{ demographicStops[2] }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="controls.currentEvictionMetric !== 'none'">
                <h2 class="font-semibold">
                    {{ evictionMetric }}
                </h2>
                {{ interpolated[controls.currentEvictionMetric] }}
            </div>
        </div>
    </div>
</template>