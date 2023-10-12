<script setup lang="ts">
import { useFeatureState } from "~/stores/feature-state-store";
import { useMapControls } from "~/stores/map-controls-store";
import { useFeatureProperties } from "~/stores/feature-properties-store";

const featureState = useFeatureState();
const featureProperties = useFeatureProperties();
const controls = useMapControls();

const { featureId } = defineProps<{
    featureId: string;
}>();

const feature = computed(
    () => featureProperties.data[controls.currentSource].find(
        (feature) => feature.id === `${controls.currentYear}${featureId}`
    )
);

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
        class="relative bg-white p-4 h-56 w-48 border shadow-xl rounded"
        @mouseover="onMouseover"
        @mouseleave="onMouseleave"
    >
        <Transition>
            <div v-if="feature">
                <TRCButton class="absolute top-1 right-1" @click="closeCard">
                    <IconXMark class="text-slate-500" />
                </TRCButton>
                <div class="space-y-2">
                    <div class="text-sm font-bold">
                        {{ feature.geog_name }}
                    </div>
                    <DetailCardItem>
                        <template #label>
                            Eviction Filing Rate 
                        </template>
                        {{ feature.filing_rate }}{{ feature.filing_rate > 0 ? "%" : "" }}
                    </DetailCardItem>
                    <DetailCardItem>
                        <template #label>
                            Eviction Filings
                        </template>
                        {{ feature.n_filings }}
                    </DetailCardItem>
                    <DetailCardItem>
                        <template #label>
                            Households
                        </template>
                        <div class="text-sm text-slate-600">renter occupied {{ feature.renter_count }}</div>
                        <div class="text-sm text-slate-600">owner occupied {{ feature.owner_count }}</div>
                    </DetailCardItem>
                </div>
            </div>
        </Transition>
    </div>
</template>