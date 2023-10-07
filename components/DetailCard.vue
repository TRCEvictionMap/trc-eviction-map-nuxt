<script setup lang="ts">
import { useMapControls } from "~/stores/map-controls-store";
import { useSelectedFeatures } from "~/stores/selected-features-store";

const selectedFeatures = useSelectedFeatures();
const controls = useMapControls()

const props = defineProps<{
    featureId: string;
}>();

const feature = await useFeatureProperties(
    controls.currentSource,
    props.featureId
);

const YEAR_INDEX = 0;

const filingRate = computed(() => {
    if (feature.value) {
        const { evictions, renter_count } = feature.value;
        const rate = evictions[YEAR_INDEX].n_filings / renter_count;
        return Math.round(rate * 100) / 100;
    }
});

function closeCard() {
    if (props.featureId) {
        selectedFeatures.deselect(props.featureId)
    }
}
</script>

<template>
    <div class="relative bg-white p-4 h-56 w-48 border shadow-xl rounded">
        <Transition>
            <div v-if="feature">
                <TRCButton class="absolute top-1 right-1" @click="closeCard">
                    <IconXMark class="text-slate-500" />
                </TRCButton>

                <div class="space-y-2">
                    <div class="text-sm font-bold">
                        {{ feature.feature_name }}
                    </div>
                    <DetailCardItem label="Eviction Filing Rate">
                        {{ filingRate }}
                    </DetailCardItem>
                    <DetailCardItem label="Eviction Filings">
                        {{ feature.evictions[YEAR_INDEX].n_filings }}
                    </DetailCardItem>
                    <DetailCardItem label="Households">
                        <div class="text-sm text-slate-600">renter occupied {{ feature.renter_count }}</div>
                        <div class="text-sm text-slate-600">owner occupied {{ feature.owner_count }}</div>
                    </DetailCardItem>
                </div>
            </div>
        </Transition>
    </div>
</template>