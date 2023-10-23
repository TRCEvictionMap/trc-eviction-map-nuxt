import { defineStore } from "pinia";

const useSettings = defineStore("settings", () => {
    const verticalDetailCards = ref(true);
    const showAlderDistricts = ref(false);

    return { verticalDetailCards, showAlderDistricts };
});

export { useSettings };
