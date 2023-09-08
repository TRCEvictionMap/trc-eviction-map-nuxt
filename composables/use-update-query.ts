import { WatchSource } from "nuxt/dist/app/compat/capi";

type QueryKey = "source" | "features";

/**
 * Watches a reactive data source and updates the query string with the value
 * @param source 
 * @param queryKey 
 */
function useUpdateQuery(source: WatchSource, queryKey: QueryKey) {
    const router = useRouter();
    const route = useRoute();

    watch(source, (value) => {

        if (Array.isArray(value)) {
            value = value.length > 0 ? value.join(",") : undefined;
        }

        router.replace({
            query: {
                ...route.query,
                [queryKey]: value,
            }
        })
    });
}

export { useUpdateQuery };
