<script setup lang="ts">

</script>

<template>
    <div class="absolute top-4 flex justify-center self-center z-10">
        <div class="
            flex justify-center items-center flex-shrink-0
            p-4
            rounded border shadow-2xl
            bg-white
        ">
            <div class="flex items-center space-x-4">
                <span class="font-semibold">Evictions by</span>
                <ControlBarSourceSelect />
                <span class="font-semibold">in</span>
                <ControlBarYearSelect />
            </div>
        </div>
    </div>
</template>
