export default function headerTranslation(key: string) {
    switch(key){
        case "id": return "Block Group";
        case "renter_count": return "Renter Count";
        case "renter_rate": return "Renter Rate";
        case "poverty_rate": return "Poverty Rate";
        case "n_filings": return "Filings";
        case "pop": return "Population";
        case "pct_ai": return "Percent American Indian";
        case "pct_as": return "Percent Asian";
        case "pct_bl": return "Percent Black";
        case "pct_hl": return "Percent Hispanic or Latino";
        case "pct_multi": return "Percent Multiple Races";
        case "pct_other": return "Percent Other";
        case "pct_pi": return "Percent Pacific Islander";
        case "pct_wh": return "Percent White";
        case "district": return "School District";
        case "cesa": return "CESA ID";
        case "lea_id": return "LEA ID";
        case "district_type": return "District Type";
        default: return "Unknown";
    }
}