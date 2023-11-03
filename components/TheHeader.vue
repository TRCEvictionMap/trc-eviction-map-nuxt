<script setup lang="ts">
import { useDisclosures } from "~/stores/disclosures-store";

const disclosures = useDisclosures();

</script>

<template>
    <header class="flex justify-between items-center py-1 px-4 text-trc-blue-700 border-b border-trc-blue-700/20">
        <NuxtPicture
            format="webp"
            src="/TRC_logo_Blue_Vector_Transparent.png"
            alt="Tenant Resource Center logo"
            sizes="140px sm:180px"
        />
        <div class="flex py-2 sm:py-4">
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