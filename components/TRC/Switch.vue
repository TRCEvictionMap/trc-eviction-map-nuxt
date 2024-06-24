<script setup lang="ts">
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";

const props = defineProps<{
  modelValue: boolean;
  label?: string;
  stackLabel?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [checked: boolean];
}>();

const checked = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <SwitchGroup>
    <div
      class="flex gap-2"
      :class="{
        'flex-col items-start': stackLabel,
        'items-center': !stackLabel
      }"
    >
      <SwitchLabel v-if="label" class="text-xs font-bold text-slate-600">
        {{ label }}
      </SwitchLabel>
      <Switch
        v-model="checked"
        :class="checked ? 'bg-trc-blue-900' : 'bg-trc-blue-300'"
        class="
          relative inline-flex h-6 w-10 shrink-0 cursor-pointer
          rounded-full border-2 border-transparent transition-all duration-200 ease-in-out 
          outline-none focus-visible:ring focus-visible:ring-trc-blue-400 focus-visible:ring-offset-2
        "
      >
        <span
          aria-hidden="true"
          :class="checked ? 'translate-x-4' : 'translate-x-0'"
          class="
            pointer-events-none inline-block h-5 w-5 transform rounded-full
           bg-white shadow-lg ring-0 transition duration-200 ease-in-out
          "
        ></span>
      </Switch>
    </div>
  </SwitchGroup>
</template>