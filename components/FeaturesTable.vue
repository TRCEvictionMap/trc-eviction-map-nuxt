<script setup lang="ts">
import { useFeatureProperties } from "~/stores/feature-properties-store";
import { dataTableRowsAndCols, type DataTableColumn, type DataTableRow } from "./TRC/DataTable/data-table-types";
import { useMapControls } from "~/stores/map-controls-store";
import { useFeatureState } from "~/stores/feature-state-store";

const controls = useMapControls();
const featureProperties = useFeatureProperties();
const featureState = useFeatureState();


const { columns, rows } = dataTableRowsAndCols({
  columns: [
    {
      field: "id",
      width: 80,
      pinned: true,
      headerText: "ID",
    },
    {
      field: "n_filings",
      width: 80,
      headerText: "Filings",
      infoText: `The number of evictions filed against renters living in a given ${controls.currentSourceHumanReadable}`,
    },
    {
      field: "filing_rate",
      width: 100,
      pinned: false,
      headerText: "Filing Rate",
      infoText: `A ratio representing the number of evictions filed for every 100 renters living in a given ${controls.currentSourceHumanReadable}`,
    },
    {
      field: "renter_count",
      width: 120,
      headerText: "Renter Count",
    },
    {
      field: "renter_rate",
      width: 100,
      headerText: "Renter Rate",
    },
    {
      field: "poverty_rate",
      width: 120,
      headerText: "Poverty Rate",
    },
    {
      field:"pct_ai",
      width: 140,
      headerText: "American Indian",
      headerTitle: "Percent American Indian",
    },
    {
      field:"pct_as",
      width: 80,
      pinned: true,
      headerText: "Asian",
      headerTitle: "Percent Asian",
    },
    {
      width: 80,
      field:"pct_bl",
      headerText: "Black",
      headerTitle: "Percent Black",
    },
    {
      width: 140,
      field:"pct_multi",
      headerText: "Multiple Races",
      headerTitle: "Percent Multiple Races",
    },
    {
      width: 80,
      field:"pct_other",
      headerText: "Other",
      headerTitle: "Percent Other",
    },
    {
      width: 140,
      field:"pct_pi",
      headerText: "Pacific Islander",
      headerTitle: "Percent Pacific Islander",
    },
    {
      width: 80,
      field:"pct_wh",
      headerText: "White",
      headerTitle: "Percent White",
    },
  ],
  rows: computed(
    () => featureProperties
      .featureIds["block-group"]
      .eviction
      .map((featureId) => {
        const properties = featureProperties.getFeatureProperties("block-group", featureId)!;
        const {
          id,
          region,
          renter_count,
          renter_count_moe,
          renter_rate,
          renter_rate_moe,
          poverty_rate,
          poverty_rate_moe,
          race: {
            pct_ai,
            pct_as,
            pct_bl,
            pct_multi,
            pct_other,
            pct_pi,
            pct_wh,
          },
          evictions
        } = properties;
        const { n_filings, filing_rate } = evictions[controls.currentYear];

        return {
          id: featureId.slice(2),
          fields: {
            id: {
              value: 0,
              text: featureId.slice(2),
            },
            renter_count: {
              value: renter_count,
              moe: renter_count_moe,
              srOnly: `${renter_count} plus or minus ${renter_count_moe}`
            },
            renter_rate: {
              value: renter_rate,
              text: `${renter_rate}%`,
              moe: `${renter_rate_moe}%`,
              srOnly: `${renter_rate} plus or minus ${renter_rate_moe} percent`
            },
            poverty_rate: {
              value: poverty_rate,
              text: `${poverty_rate}%`,
              moe: `${poverty_rate_moe}%`,
              srOnly: `${poverty_rate} plus or minus ${poverty_rate_moe} percent`
            },
            n_filings: {
              value: n_filings,
            },
            filing_rate: {
              value: filing_rate,
              text: `${filing_rate}%`
            },
            pct_ai: {
              value: pct_ai,
              text: `${pct_ai}%`
            },
            pct_as: {
              value: pct_as,
              text: `${pct_as}%`
            },
            pct_bl: {
              value: pct_bl,
              text: `${pct_bl}%`
            },
            pct_multi: {
              value: pct_multi,
              text: `${pct_multi}%`,
            },
            pct_other: {
              value: pct_other,
              text: `${pct_other}%`,
            },
            pct_pi: {
              value: pct_pi,
              text: `${pct_pi}%`,
            },
            pct_wh: {
              value: pct_wh,
              text: `${pct_wh}%`,
            },
          },
        };
      })
  )
});

const selectedRows = ref<string[]>([]);

function onSelectRow(rowId: string) {
  if (selectedRows.value.includes(rowId)) {
    selectedRows.value = selectedRows.value.filter((x) => x !== rowId);
  } else {
    selectedRows.value = selectedRows.value.concat(rowId);
  }
}

</script>

<template>
  <div class="w-1/2 relative p-2 flex flex-col">
    <h1>{{ controls.currentSourceHumanReadable }}</h1>
    <p>{{ controls.currentYear }}</p>
    <TRCDataTable
      :columns="columns"
      :rows="rows" v-model="selectedRows"
      @row:mouseleave="rowId => featureState.setFeatureState('d_' + rowId, 'isHovered', false)"
      @row:mouseover="rowId => featureState.setFeatureState('d_' + rowId, 'isHovered', 'card')"
    />
    <!-- <TRCDataTable
      :columns="columns"
      :rows="rows" v-model="selectedRows"
      @row:mouseleave="rowId => featureState.setFeatureState('d_' + rowId, 'isHovered', false)"
      @row:mouseover="rowId => featureState.setFeatureState('d_' + rowId, 'isHovered', 'card')"
    >
      <template #th="{ column }">
        <th
          :key="column.field"
          :title="column.headerTitle"
          scope="col"
          class="whitespace-nowrap px-4 bg-slate-100" 
        >
          <div class="flex items-center gap-1">
            <span>{{ column.headerText }}</span>
            <TRCInfoPopover v-if="column.infoText" iconSize="sm">
              {{ column.infoText }}
            </TRCInfoPopover>
          </div>
        </th>
      </template>
      <template #row="{ row: { fields, id: rowId } }">
        <tr
          @mouseover="() => featureState.setFeatureState('d_' + rowId, 'isHovered', 'card')"
          @mouseleave="() => featureState.setFeatureState('d_' + rowId, 'isHovered', false)"
          class="divide-x divide-y"
          :class="{
            'ring-1 ring-black bg-trc-blue-100': featureState.selectedFeatures.includes(`d_${rowId}`)
          }"
        >
          <td>
            <button
              role="checkbox"
              :aria-checked="selectedRows.includes(`d_${rowId}`)"
              @click="onSelectRow(`d_${rowId}`)"
            >
              <IconCheckSquareFill v-if="selectedRows.includes(`d_${rowId}`)" class="text-trc-blue-500" />
              <IconSquare v-else />
            </button>
          </td>
          <td scope="col" class="sticky z-10 left-0 bg-slate-100 shadow-slate-950 py-2 px-2 border-b">
              {{ rowId }}
          </td>
          <td v-for="{ field } in columns" scope="col" :key="field" class="px-4">
            <div class="flex justify-between items-end">
              <span>{{ fields[field].text || fields[field].value }}</span>
              <span v-if="fields[field].moe" class="text-sm">&plusmn;{{ fields[field].moe }}</span>
            </div>
          </td>
        </tr>
      </template>
    </TRCDataTable> -->
  </div>
</template>