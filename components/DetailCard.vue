<script setup lang="ts">
import { useSelectedFeatures } from "~/stores/selected-features-store";

const selectedFeatures = useSelectedFeatures();

const props = defineProps<{
    featureId?: string;
}>();

function closeCard() {
    if (props.featureId) {
        selectedFeatures.deselect(props.featureId)
    }
}
</script>

<template>
    <div class="relative bg-white p-4 h-56 w-40 border shadow-xl rounded">
        <Transition>
            <div v-if="featureId">
                <TRCButton class="absolute top-1 right-1" @click="closeCard">
                    <IconXMark class="text-slate-500" />
                </TRCButton>
                {{ featureId }}
                <div class="space-y-2">
                    <DetailCardItem label="Eviction Filing Rate">
                        ?
                    </DetailCardItem>
                    <DetailCardItem label="Eviction Filings">
                        ?
                    </DetailCardItem>
                    <DetailCardItem label="Population">
                        ?
                    </DetailCardItem>
                </div>
            </div>
        </Transition>
    </div>
</template>