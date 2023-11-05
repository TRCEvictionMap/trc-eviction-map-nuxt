<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from "@headlessui/vue";
import { useDisclosures } from "~/stores/disclosures-store";

const disclosures = useDisclosures();

onBeforeRouteLeave(() => {
    disclosures.showMobileNav = false;
});

</script>

<template>
    <div>
        <button @click="disclosures.showMobileNav = true" class="button button--square">
            <IconBars2 />
        </button>
        <TransitionRoot appear :show="disclosures.showMobileNav" as="template">
            <Dialog as="div" @close="disclosures.showMobileNav = false" class="absolute top-0 right-0 z-10">
                <TransitionChild
                    enter="duration-300 ease-out"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="duration-200 ease-in"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                >
                    <div class="fixed inset-0 bg-black/30" aria-hidden="true"></div>
                </TransitionChild>
                <TransitionChild
                    as="template"
                    enter="duration-200 ease-out"
                    enter-from="translate-x-[300px] opacity-0"
                    enter-to="translate-x-0 opacity-100"
                    leave="duration-150 ease-in"
                    leave-to="translate-x-[300px] opacity-0"
                    leave-from="translate-x-0"
                >
                    <div class="fixed top-0 inset-0 flex w-screen items-center justify-end min-h-screen">
                        <DialogPanel class="min-h-screen bg-white p-2 space-y-4 w-60 flex flex-col">
                            <button @click="disclosures.showMobileNav = false" class="button button--square self-end">
                                <IconXMark />
                            </button>
                            <nav>
                                <ul class="space-y-4 p-2 flex flex-col items-end text-xl">
                                    <li>
                                        <NuxtLink to="/">Map</NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink to="/about">About</NuxtLink>
                                    </li>
                                </ul>
                            </nav>
                        </DialogPanel>
                    </div>

                </TransitionChild>
            </Dialog>
        </TransitionRoot>
    </div>
</template>