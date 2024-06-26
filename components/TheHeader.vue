<script setup lang="ts">
import { useDisclosures } from "~/stores/disclosures-store";
import { useFeatureFlags } from "~/stores/feature-flags";
import { useSettings } from "~/stores/settings-store";

const disclosures = useDisclosures();
const settings = useSettings();
const flags = useFeatureFlags();

</script>

<template>
  <header class="flex justify-between items-center py-1 px-4 text-trc-blue-700 border-b border-trc-blue-700/20">
    <NuxtLink
      to="https://www.tenantresourcecenter.org/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <NuxtPicture
        format="webp"
        src="/trc_logo_horizontal_color.png"
        alt="Tenant Resource Center logo"
        sizes="130px sm:150px"
      />
    </NuxtLink>
    <div class="flex py-1 sm:py-3">
      <nav class="flex items-center gap-4 divide-x divide-slate-500">
        <ClientOnly>
          <div class="flex gap-4">
            <TRCSwitch
              v-if="true"
              v-model="settings.options.showBottomPanel"
              :label="`${settings.options.showBottomPanel ? 'Hide' : 'Show'} Data Table`"
            />
            <TRCSwitch
              v-if="!flags.disableDataTableHeaderToggle"
              v-model="settings.options.showLeftPanel"
              :label="`${settings.options.showLeftPanel ? 'Hide' : 'Show'} Side Panel`"
            />
          </div>
        </ClientOnly>
        <div class="pl-4">
          <button @click="disclosures.showWelcomeModal = true">
            About
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>