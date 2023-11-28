const letters = "abcdefghijklmnopqrstuvwxyz";

interface FootnoteInstance {
    backlink: string;
    letter: string;
}

function useFootnotes() {
    const instances = inject<Ref<Record<number, FootnoteInstance[]>>>("footnote-instances");

    function registerInlineFootnote(number: number) {
        if (!instances) {
            return "";
        }

        if (!instances.value[number]) {
            instances.value[number] = [];
        }

        const inlineFootnoteId = `footnote_${number}_${instances.value[number].length + 1}`;

        instances.value[number].push({
            backlink: inlineFootnoteId,
            letter: letters[instances.value[number].length],
        });

        return inlineFootnoteId;
    }

    return {
        registerInlineFootnote,
        instances: instances as Ref<Record<number, FootnoteInstance[]>>,
    };
}

export { useFootnotes };
