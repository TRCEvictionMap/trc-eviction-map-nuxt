<script setup lang="ts">

const show = ref(true);

const permanentlyDismissed = useLocalStorage(
  "permanently-dismissed",
  false
);

</script>

<template>
  <TRCModal :open="show && !permanentlyDismissed">
    
    <div class="flex gap-2">
      <button class="button border" @click="permanentlyDismissed = true">
        Permanently Dismiss
      </button>
      <button class="button border" @click="show = false">
        Dismiss
      </button>
    </div>
  </TRCModal>
</template>