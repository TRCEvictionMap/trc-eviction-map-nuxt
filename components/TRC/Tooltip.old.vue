<script setup lang="ts">
import type { CSSProperties } from 'nuxt/dist/app/compat/capi';


const props = defineProps<{
    label?: string;
    delay?: number;
    focusable?: boolean;
    contentWidth: number;
    contentHeight: number;
}>();

const isOpen = ref(false); 
const tooltipTrigger = ref<HTMLDivElement>();


provide("isOpen", isOpen);
provide("tooltipTrigger", tooltipTrigger);
provide("registerTooltipContent", registerTooltipContent);

const tooltipContent = ref<HTMLDivElement>();

function registerTooltipContent(contentDiv: HTMLDivElement) {
    tooltipContent.value = contentDiv;
}


watch(isOpen, (val) => {
    if (val) {
        window.addEventListener("keydown", onWindowKeydown);
    } else {
        window.removeEventListener("keydown", onWindowKeydown);
    }
});

onBeforeUnmount(() => {
    if (isOpen.value) {
        window.removeEventListener("keydown", onWindowKeydown);
    }
});

function onWindowKeydown(ev: KeyboardEvent) {
    if (ev.key === "Escape") {
        isOpen.value = false;
    }
}

const tooltipStyle = ref<CSSProperties>({
    height: `${props.contentHeight}px`,
    width: `${props.contentWidth}px`,
    bottom: "32px",
});





function getTooltipPosition(ev: MouseEvent | FocusEvent) {
    if (tooltipTrigger.value) {
        const { x, y, top, bottom, width, height } = tooltipTrigger.value.getBoundingClientRect();
        console.log({
            x,
            y,
            top,
            bottom,
            width,
            height,
        });
    }
    console.log(tooltipTrigger.value?.getAnimations());
}

function onMouseover(ev: MouseEvent) {
    const position = getTooltipPosition(ev);
    console.log(position);
    isOpen.value = true;
}

function onMouseleave(ev: MouseEvent) {
    isOpen.value = false;
}

function onFocus(ev: FocusEvent) {
    const position = getTooltipPosition(ev);
    console.log(position);
    isOpen.value = true;
}

function onBlur(ev: FocusEvent) {
    isOpen.value = false;
}

</script>

<template>
    <div
        class="relative inline-block"
        ref="tooltipTrigger"
        role="tooltip"
        :tabindex="focusable ? '0' : '-1'"
        @mouseover="onMouseover"
        @mouseleave="onMouseleave"
        @focus="onFocus"
        @blur="onBlur"
    >
        <span :aria-describedby="($attrs.id as string)">
            <slot name="trigger"></slot>
        </span>
        
        <slot></slot>
        <!-- <div
            class="absolute flex flex-col items-center"
            :style="tooltipStyle"
        >
            <div class="bg-white text-black text-xs p-2 rounded-sm shadow-2xl flex-0">
                <slot></slot>
            </div>
            <div class="w-3 h-3 rotate-45 -translate-y-1/2 bg-white shadow-2xl"></div>
        </div> -->

        <!-- <div
            class="underline decoration-dotted"
            :aria-describedby="($attrs.id as string)"
        >
            {{ label }}
        </div>
        <div v-if="open" class="absolute bottom-4 flex flex-col items-center">
            <div class="bg-black text-white text-xs p-2 rounded-sm flex-0">
                <slot></slot>
            </div>
            <div class="w-3 h-3 rotate-45 -translate-y-1/2 bg-black"></div>
        </div> -->
    </div>
</template>