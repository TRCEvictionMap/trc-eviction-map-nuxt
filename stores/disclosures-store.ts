import { defineStore } from "pinia";

const useDisclosures = defineStore("disclosures", () => {
    const showSearch = ref(false);
    const showMobileNav =  ref(false);

    return { showSearch, showMobileNav };
});

export { useDisclosures };
