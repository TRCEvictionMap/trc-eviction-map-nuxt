<script setup lang="ts">
import { useDisclosures } from "~/stores/disclosures-store";

const disclosures = useDisclosures();

</script>

<template>
    <header class="flex justify-between items-center py-1 px-4 text-trc-blue-700 border-b border-trc-blue-700/20">
        <NuxtLink to="https://www.tenantresourcecenter.org/" target="_blank" rel="noopener noreferrer">
            <NuxtPicture
                format="webp"
                src="/trc_logo_horizontal_color.png"
                alt="Tenant Resource Center logo"
                sizes="130px sm:150px"
            />
        </NuxtLink>
        <div class="flex py-1 sm:py-3">
            <nav>
                <button @click="disclosures.showWelcomeModal = true" class="">
                    About
                </button>
            </nav>
            <!-- <NavDrawer class="sm:hidden" />
            <nav class="hidden sm:block">
                <button @click="disclosures.showWelcomeModal = true" class="">
                    About
                </button>
            </nav> -->
        </div>
    </header>
</template>