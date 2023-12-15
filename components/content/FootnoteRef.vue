
<script setup lang="ts">
import { Popover, PopoverPanel } from "@headlessui/vue";

const props = defineProps<{
    footnoteId: string; 
}>();

const footnotes = useFootnotes();

const footnoteContent = footnotes.content.value[props.footnoteId];

const titleContent = computed(() => {
    const footnoteContent = footnotes.content.value[props.footnoteId];
    if (footnoteContent) {
        const { author, pageTitle } = footnoteContent;
        return `${author}, "${pageTitle}"`;
    }
    return "";
});

const id = footnotes.registerFootnoteRef(props.footnoteId);

const ordering = computed(
    () => footnotes.ordering.value.indexOf(props.footnoteId) + 1
);

</script>

<template>
    <NuxtLink
        class="text-trc-orange-500 inline-block !no-underline !-mt-2 !pt-2"
        :id="id"
        :to="{ hash: `#footnote-bottom_${ordering}` }"
        :title="titleContent"
    >
        <sup >
            [{{ ordering }}]
        </sup>
    </NuxtLink>
    <!-- <TRCTooltip focusable :contentWidth="300" :contentHeight="200">
        <template #trigger>
            <NuxtLink
                class="text-trc-orange-500 !no-underline !-mt-2 !pt-2"
                :id="id"
                :to="{ hash: `#footnote-bottom_${ordering}` }"   
            >
                <sup>
                    [{{ ordering }}]
                </sup>
            </NuxtLink>
        </template>
        <TRCTooltipContent>
            {{ footnoteContent }}
        </TRCTooltipContent>
    </TRCTooltip> -->
</template>