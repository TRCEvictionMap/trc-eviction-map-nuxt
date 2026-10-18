<script setup lang="ts" generic="T">
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import headerTranslation from './header-translation';
import {useFeatureState} from "~/stores/feature-state-store";
import { useMapControlsV2 } from '~/stores/map-controls-store-v2';
const props = defineProps<{
    selectedRows: any;
}>();
XLSX.set_fs(fs);
const controls = useMapControlsV2();
const handleTableDownload = () => {
    const featureState = useFeatureState();
    //translate JSON to Excel
    let xlArray = [];
    for (const row of props.selectedRows) {
        let outputRow = {};
        Object.keys(row.fields).forEach( (f: any) => {
            outputRow = {...outputRow, [headerTranslation(f.toString())]: row.fields[f].value};
        })
        xlArray.push(outputRow);
    }

function generate_book_title() {
    try {
        let title = "";
    if (controls.currentSource == 'block-group') {
        title = title + "Block Group Evictions Report "
    }
    else if (controls.currentSource == 'school-district') {
        title = title + "School District Evictions Report "
    }
    const rangeArray = controls.currentMonthRange.toString().split(",");
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
    const startArray = rangeArray[0].split("-");
    const endArray = rangeArray[1].split("-");
    title = title + MONTHS[+startArray[1] - 1] + " " + startArray[0] +  "-" + MONTHS[+endArray[1] - 1] + " " + endArray[0] +  ".xlsx";
    return title
    }
    catch {
        return "TRC Evictions Report.xlsx";
    }
}

    //Read the contents of the selected table, convert to XLSX
    
    const sheet = XLSX.utils.json_to_sheet(xlArray);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Stats");
    XLSX.writeFile(book, generate_book_title());
    return;
}
</script>
<template>
    <button aria-expanded="false" data-headlessui-state="" class="px-2 py-1 border rounded text-start whitespace-nowrap text-sm outline-none focus:ring focus:ring-trc-blue-400 focus:ring-offset-2" @click="handleTableDownload">
        <span class="font-bold">Download Selected</span>
    </button>
</template>