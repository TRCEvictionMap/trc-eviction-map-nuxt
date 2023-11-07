<script setup lang="ts">
import { useDisclosures } from "~/stores/disclosures-store";

const disclosures = useDisclosures();

</script>

<template>
    <header class="flex justify-between items-center py-1 px-4 text-trc-blue-700 border-b border-trc-blue-700/20">
        <NuxtPicture
            format="webp"
            src="/trc_logo_horizontal_color.png"
            alt="Tenant Resource Center logo"
            sizes="150px sm:170px"
        />
        <div class="flex py-2 sm:py-4">
            <NavDrawer class="sm:hidden" />
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