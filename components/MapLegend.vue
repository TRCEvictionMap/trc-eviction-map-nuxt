<script setup lang="ts">
import { useMapControls } from "~/stores/map-controls-store";
import { interpolateFillRGBA } from "~/composables/use-interpolated-color-values";

const interpolated = useInterpolatedColorValues();
const controls = useMapControls();

const demographicMetricName = computed(() =>
    controls.demographicMetricOptions.find(
        ({ value }) => value === controls.currentDemographicMetric
    )?.text
);

const evictionMetric = computed(() =>
    controls.evictionMetricOptions.find(
        ({ value }) => value === controls.currentEvictionMetric
    )?.text
);

const demographicStops = computed(() =>
    Object.keys(interpolated[controls.currentDemographicMetric])
);

const evictionStops = computed(() =>
    Object.keys(interpolated[controls.currentEvictionMetric])
);

const evictionStopSizes = computed(() =>
    evictionStops.value.map(
        (stop) => (interpolated[controls.currentEvictionMetric] as Record<string, number>)[stop] * 2
    )
);

</script>

<template>
    <div class="absolute bottom-8 right-4 self-end shadow-xl border rounded p-4 bg-white">

        <div class="flex space-x-4">

            <div v-if="controls.currentDemographicMetric !== 'none'" class="w-52 space-y-2">
                <h2 class="font-semibold text-sm">
                    {{ demographicMetricName }}
                </h2>
                <div>
                    <div
                        class="h-6 w-full"
                        :style="{
                            background: `linear-gradient(to right, ${interpolateFillRGBA(0.05)}, ${interpolateFillRGBA(0.8)})`
                        }"
                    ></div>
                    <div class="relative h-8 text-sm">
                        <div class="absolute left-[10%]">
                            <div class="h-2 border-r border-black w-[1px]"></div>
                            <div class="-translate-x-[50%]">
                                {{ demographicStops[0] }}
                            </div>
                        </div>
                        <div class="absolute left-[50%]">
                            <div class="h-2 border-r border-black w-[1px]"></div>
                            <div class="-translate-x-[50%]">
                                {{ demographicStops[1] }}
                            </div>
                        </div>
                        <div class="absolute left-[90%]">
                            <div class="h-2 border-r border-black w-[1px]"></div>
                            <div class="-translate-x-[50%]">
                                {{ demographicStops[2] }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="controls.currentEvictionMetric !== 'none' && controls.currentDemographicMetric !== 'none'"
                class="border-r border-slate-300"
            ></div>

            <div v-if="controls.currentEvictionMetric !== 'none'" class="w-36 space-y-2">
                <h2 class="font-semibold text-sm">
                    {{ evictionMetric }}
                </h2>
                <div>
                    <div class="relative flex items-center h-8">
                        <div class="border-b border-slate-300 w-full"></div>
                        <div class="absolute w-full top-0 h-8 flex items-center">
                            <div class="absolute left-[10%]">
                                <div
                                    class="-translate-x-[50%] rounded-full bg-trc-orange-400 border border-black box-content"
                                    :style="{
                                        height: `${evictionStopSizes[1]}px`,
                                        width: `${evictionStopSizes[1]}px`
                                    }"
                                ></div>
                            </div>
                            <div class="absolute left-[50%]">
                                <div
                                    class="-translate-x-[50%] rounded-full bg-trc-orange-400 border border-black box-content"
                                    :style="{
                                        height: `${evictionStopSizes[2]}px`,
                                        width: `${evictionStopSizes[2]}px`
                                    }"
                                ></div>
                            </div>
                            <div class="absolute left-[90%]">
                                <div
                                    class="-translate-x-[50%] rounded-full bg-trc-orange-400 border border-black box-content"
                                    :style="{
                                        height: `${evictionStopSizes[3]}px`,
                                        width: `${evictionStopSizes[3]}px`
                                    }"
                                ></div>
                            </div>
                        </div>
                        <div class="text-sm absolute w-full bottom-0">
                            <span class="absolute left-[10%] -translate-x-[50%]">
                                {{ evictionStops[1] }}
                            </span>
                            <span class="absolute left-[50%] -translate-x-[50%]">
                                {{ evictionStops[2] }}
                            </span>
                            <span class="absolute left-[90%] -translate-x-[50%]">
                                {{ evictionStops[3] }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>