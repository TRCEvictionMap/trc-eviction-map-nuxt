import { defineStore } from "pinia";

const useDisclosures = defineStore("disclosures", () => {
    const showSearch = ref(false);
    const showMobileNav =  ref(false);

    const showDetailModal = ref(false);

    return { showSearch, showMobileNav, showDetailModal };
});

export { useDisclosures };
