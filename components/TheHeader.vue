<script setup lang="ts">
import { useDisclosures } from "~/stores/disclosures-store";

const disclosures = useDisclosures();

</script>

<template>
    <header class="flex justify-between items-center p-4 text-trc-blue-700">
        <h1 class="font-bold text-xl">
            TRC Eviction Map
        </h1>
        <div class="flex">
            <button class="sm:hidden" @click="disclosures.showMobileNav = true">
                <IconBars2 />
            </button>
            <nav class="hidden sm:block">
                <ul class="flex space-x-4">
                    <li>
                        <NuxtLink to="/">Map</NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/about">About</NuxtLink>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
</template>