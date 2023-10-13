import { defineStore } from "pinia";

const useSettings = defineStore("settings", () => {
    const verticalDetailCards = ref(true);
    const showAlderDistricts = ref(true);

    return { verticalDetailCards, showAlderDistricts };
});

export { useSettings };
