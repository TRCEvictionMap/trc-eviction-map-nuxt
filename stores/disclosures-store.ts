import { defineStore } from "pinia";

const useDisclosures = defineStore("disclosures", () => {
    const showSearch = ref(false);
    const showMobileNav =  ref(false);

    const showDetails = ref(false);

    return { showSearch, showMobileNav, showDetails };
});

export { useDisclosures };
