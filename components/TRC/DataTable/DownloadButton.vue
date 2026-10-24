<script setup lang="ts" generic="T">
import * as fs from 'fs';
import headerTranslation from './header-translation';
import {useFeatureState} from "~/stores/feature-state-store";
import { useMapControlsV2 } from '~/stores/map-controls-store-v2';
const props = defineProps<{
    selectedRows: any;
}>();
const controls = useMapControlsV2();
const handleTableDownload = () => {
    const featureState = useFeatureState();
    //translate JSON to CSV
    let xlArray = [];
    for (const row of props.selectedRows) {
        let outputRow = {};
        Object.keys(row.fields).forEach( (f: any) => {
            outputRow = {...outputRow, [headerTranslation(f.toString())]: row.fields[f].value};
        })
        xlArray.push(outputRow);
    }
    const header = Object.keys(xlArray[0]);

    const dataRows = xlArray.map((row: any) => 
        header.map((h:any) => {
            const value = row[h] === null || row[h] === undefined ? '' : row[h];
            const escaped = ('' + value).replace(/"/g, '""'); // Escape inner quotes
            return `"${escaped}"`;
        }).join(",")
    );
    const csvContent = [header.join(","), ...dataRows].join('\n');
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
        title = title + MONTHS[+startArray[1] - 1] + " " + startArray[0] +  "-" + MONTHS[+endArray[1] - 1] + " " + endArray[0] +  ".csv";
        return title
        }
        catch {
            return "TRC Evictions Report.csv";
        }
    }
    const filename = generate_book_title();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
}
</script>
<template>
    <button aria-expanded="false" data-headlessui-state="" class="px-2 py-1 border rounded text-start whitespace-nowrap text-sm outline-none focus:ring focus:ring-trc-blue-400 focus:ring-offset-2" @click="handleTableDownload">
        <span class="font-bold">Download Selected</span>
    </button>
</template>