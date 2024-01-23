<script setup lang="ts">
import { useFeatureState } from "~/stores/feature-state-store";
import { useMapControls } from "~/stores/map-controls-store";
import { useFeatureProperties } from "~/stores/feature-properties-store";
import { useSettings } from "~/stores/settings-store";

const featureState = useFeatureState();
const featureProperties = useFeatureProperties();
const controls = useMapControls();
const settings = useSettings();

const { featureId } = defineProps<{
    featureId: string;
}>();

const feature = computed(() => {
    const properties = featureProperties.getFeatureProperties(
        controls.currentSource,
        featureId,
    );

    if (properties) {
        const { evictions, id, ...props } = properties;

        return {
            ...props,
            ...evictions[controls.currentYear],
            id: id.replace(/\w_/, ""),
        };
    }
});

function closeCard() {
    if (featureId) {
        featureState.setFeatureState(featureId, "isSelected", false);
        featureState.setFeatureState(featureId, "isHovered", false);
    }
}

function onMouseover() {
    featureState.setFeatureState(featureId, "isHovered", "card");
}

function onMouseleave() {
    featureState.setFeatureState(featureId, "isHovered", false);
}
</script>

<template>
    <div
        class="relative bg-white p-4 w-64 border shadow-xl rounded"
        @mouseover="onMouseover"
        @mouseleave="onMouseleave"
    >
        <Transition>
            <div v-if="feature">
                <TRCButton class="absolute top-1 right-1" @click="closeCard">
                    <IconXMark class="text-slate-500" />
                </TRCButton>
                <div class="space-y-2 text-sm">
                    <div class=" font-bold">
                        {{ feature.region }} {{ feature.id }}
                    </div>

                        <ul class="space-y-1">
                            <li class="flex justify-between" :class="{ 'border-b': settings.options.detailCardListUnderlineItems }">
                                <span>Eviction Filings:</span>
                                <span>{{ feature.n_filings }}</span>
                            </li>
                            <li class="flex justify-between" :class="{ 'border-b': settings.options.detailCardListUnderlineItems }">
                                <span>Total Renter Households:</span>
                                <span>{{ feature.renter_count }}</span>
                            </li>
                            <li class="flex justify-between" :class="{ 'border-b': settings.options.detailCardListUnderlineItems }">
                                <span>Eviction Filing Rate:</span>
                                <span>{{ feature.filing_rate }}%</span>
                            </li>
                            <li class="flex justify-between" :class="{ 'border-b': settings.options.detailCardListUnderlineItems }">
                                <span>Percent Renter Occupied:</span>
                                <span>{{ feature.renter_rate }}%</span>
                            </li>
                            <li class="flex justify-between" :class="{ 'border-b': settings.options.detailCardListUnderlineItems }">
                                <span>Poverty Rate:</span>
                                <span>{{ feature.poverty_rate }}%</span>
                            </li>
                        </ul>
                </div>
            </div>
        </Transition>
    </div>
</template>