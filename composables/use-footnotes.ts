
const LETTERS = "abcdefghijklmnopqrstuvwxyz";

interface FootnoteRefInstance {
    footnoteId: string;
    backlink: string;
    letter: string;
}

function useFootnotes() {
    const references = inject<Ref<Record<string, FootnoteRefInstance[]>>>("footnote-refs");
    const ordering = inject<Ref<FootnoteRefInstance["footnoteId"][]>>("footnote-ordering");

    function registerFootnoteRef(footnoteId: string) {
        if (!references || !ordering) {
            return "";
        }

        if (!references.value[footnoteId]) {
            references.value[footnoteId] = [];
            ordering.value.push(footnoteId);
        }
        
        const footnoteOrder = ordering.value.indexOf(footnoteId) + 1;
        const footnoteRefOrder = references.value[footnoteId].length + 1;

        const backlink = `footnote_${footnoteOrder}_${footnoteRefOrder}`;

        references.value[footnoteId].push({
            footnoteId,
            backlink,
            letter: LETTERS[footnoteRefOrder - 1],
        });

        return backlink;
    }

    return {
        registerFootnoteRef,
        ordering: ordering!,
        references: references!
    };
}

export { useFootnotes };
