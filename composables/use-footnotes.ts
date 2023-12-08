import type { FootnoteListItemProps } from "~/components/content/FootnoteListItem.vue";

const LETTERS = "abcdefghijklmnopqrstuvwxyz";

interface FootnoteRefInstance {
    footnoteId: string;
    backlink: string;
    letter: string;
}

type FootnoteContentPreview = Pick<FootnoteListItemProps, "author" | "pageTitle">;

function useFootnotes() {
    const references = inject<Ref<Record<string, FootnoteRefInstance[]>>>("footnote-refs")!;
    const content = inject<Ref<Record<string, FootnoteContentPreview>>>("footnote-content")!;
    const ordering = inject<Ref<FootnoteRefInstance["footnoteId"][]>>("footnote-ordering")!;

    if (!references || !content || !ordering) {
        console.warn(
            "[useFootnotes] some dependencies are undefined!",
            { references, content, ordering }
        );
    }

    function registerFootnoteRef(footnoteId: string) {
        if (!references.value[footnoteId]) {
            references.value[footnoteId] = [];
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
        ordering,
        references,
        content,
    };
}

export { useFootnotes };
