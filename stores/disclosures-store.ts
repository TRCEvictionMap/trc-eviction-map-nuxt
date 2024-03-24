import { defineStore } from "pinia";

const useDisclosures = defineStore("disclosures", () => {
    const showSearch = ref(false);
    const showMobileNav =  ref(false);
    
    const showWelcomeModal = ref(false);

    const showDetails = ref(false);

    return { showSearch, showMobileNav, showDetails, showWelcomeModal };
});

export { useDisclosures };
