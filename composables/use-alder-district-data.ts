import { AlderDistricts, FeatureId } from "~/utils/types";

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

function formatDateString(original: string) {
    const date = new Date(original);
    return {
        original,
        month: `${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
        year: `${date.getFullYear()}`,
    };
}

interface AlderDistrictData {
    id: FeatureId;
    evictionCounts: {
        byMonth: Record<string, number>;
        byYear: Record<string, number>;
    };
}

function useAlderDistrictData(alderGeoJson: AlderDistricts) {
    return alderGeoJson.features.map((district) => {
        const { id, properties } = district;
        
        const data: AlderDistrictData = {
            id,
            evictionCounts: {
                byMonth: {},
                byYear: {},
            },
        };

        properties.forEach((item) => {
            const { count } = item;
            const date = formatDateString(item.month);
            data.evictionCounts.byMonth[date.month] = count;
            data.evictionCounts.byYear[date.year] =
                (data.evictionCounts.byYear[date.year] ?? 0) + count;
        });

        return data;
    });
}

export { useAlderDistrictData };
