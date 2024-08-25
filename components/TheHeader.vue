<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
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
      <nav class="flex items-center gap-4">
        <ClientOnly>
          <div class="hidden sm:flex gap-4">
            <TRCSwitch
              v-if="!flags.disableDataTableHeaderToggle"
              v-model="settings.options.showLeftPanel"
              :label="`${settings.options.showLeftPanel ? 'Hide' : 'Show'} Side Panel`"
            />
            <TRCSwitch
              v-if="!flags.disableDataTableHeaderToggle"
              v-model="settings.options.showBottomPanel"
              :label="`${settings.options.showBottomPanel ? 'Hide' : 'Show'} Data Table`"
            />
          </div>
          <Popover class="sm:hidden w-full z-50 relative">
            <PopoverButton
              class="rounded-full p-1 hover:bg-slate-100 focus:ring-2 focus:bg-slate-100"
              title="Adjust map layers"
            >
              <IconGear class="" />
            </PopoverButton>
            <Transition
              enterActiveClass="transition duration-200 ease-out"
              enterFromClass="-translate-y-2 opacity-0"
              enterToClass="translate-y-0 opacity-100"
              leaveActiveClass="transition duration-150 ease-in"
              leaveFromClass="translate-y-0 opacity-100"
              leaveToClass="-translate-y-2 opacity-0"
            >
              <PopoverPanel class="absolute z-10 right-0 bg-white rounded border space-y-2 shadow-xl">
                <div class="space-y-4 p-4 border-b w-48">
                  <TRCSwitch
                    v-if="!flags.disableDataTableHeaderToggle"
                    v-model="settings.options.showLeftPanel"
                    :label="`${settings.options.showLeftPanel ? 'Hide' : 'Show'} Side Panel`"
                  />
                  <TRCSwitch
                    v-if="!flags.disableDataTableHeaderToggle"
                    v-model="settings.options.showBottomPanel"
                    :label="`${settings.options.showBottomPanel ? 'Hide' : 'Show'} Data Table`"
                  />
                </div>
              </PopoverPanel>
            </Transition>
          </Popover>
        </ClientOnly>
        <div class="h-6 border border-slate-300 ml-2"></div>
        <div class="pl-2">
          <button @click="disclosures.showWelcomeModal = true">
            About
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>