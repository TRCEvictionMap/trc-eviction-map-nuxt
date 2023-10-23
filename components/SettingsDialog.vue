<script setup lang="ts">
import {
    Dialog,
    DialogTitle,
    DialogDescription,
    DialogPanel,
    RadioGroup,
    RadioGroupOption,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/vue";
import { useSettings } from "~/stores/settings-store";

const settings = useSettings();

</script>

<template>
    <Dialog class="absolute top-0 z-10 w-full h-full flex justify-center items-center">
        <DialogPanel class="w-full max-w-md transform overflow-auto max-h-[80%] border rounded bg-white p-4 text-left align-middle shadow-xl transition-all space-y-4">
            <button class="absolute right-4 top-4 button button-dense" @click="$emit('close')">
                close
            </button>
            <DialogTitle class="font-bold text-xl my-0 py-0">Settings</DialogTitle>
            <DialogDescription>
                Turn some knobs and flick some switches :)
            </DialogDescription>
            <div class="space-y-3">
                <div>
                    <button
                        class="bg-slate-200 px-2 py-1 rounded"
                        @click="settings.options.verticalDetailCards = !settings.options.verticalDetailCards"
                    >
                        {{ settings.options.verticalDetailCards ? "Horizontal" : "Vertical" }} detail cards
                    </button>
                </div>
                <div>
                    <button
                        class="bg-slate-200 px-2 py-1 rounded"
                        @click="settings.options.showAlderDistricts = !settings.options.showAlderDistricts"
                    >
                        {{ settings.options.showAlderDistricts ? "Hide" : "Show" }} alder district outlines
                    </button>
                </div>
            </div>
        </DialogPanel>
    </Dialog>
</template>