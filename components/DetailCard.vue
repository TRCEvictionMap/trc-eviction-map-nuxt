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
                        {{ feature.geog_name }}
                    </div>
                    <DetailCardItem>
                        <template #label>
                            Eviction Filing Rate
                            <!-- <TRCTooltip focusable label="Eviction Filing Rate">
                                Represents the number of eviction filings per 100 renter occupied households.
                            </TRCTooltip> -->
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