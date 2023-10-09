<script setup lang="ts">
const props = defineProps<{
    label: string;
    delay?: number;
    focusable?: boolean;
}>();

console.log(props.focusable)

const open = ref(false);

watch(open, (val) => {
    if (val) {
        window.addEventListener("keydown", onWindowKeydown);
    } else {
        window.removeEventListener("keydown", onWindowKeydown);
    }
});

onBeforeUnmount(() => {
    if (open.value) {
        window.removeEventListener("keydown", onWindowKeydown);
    }
});

function onWindowKeydown(ev: KeyboardEvent) {
    if (ev.key === "Escape") {
        open.value = false;
    }
}

function onMouseover(ev: MouseEvent) {
    open.value = true;
}

function onMouseleave(ev: MouseEvent) {
    open.value = false;
}

function onFocus(ev: FocusEvent) {
    open.value = true;
}

function onBlur(ev: FocusEvent) {
    open.value = false;
}

</script>

<template>
    <div
        class="relative"
        role="tooltip"
        :tabindex="focusable ? '0' : '-1'"
        @mouseover="onMouseover"
        @mouseleave="onMouseleave"
        @focus="onFocus"
        @blur="onBlur"
    >
        <div
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
        </div>
    </div>
</template>