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
      width: 120,
      pinned: true,
      headerText: controls.currentSourceHumanReadable ?? "ID",
      disableSort: true,
    },
    {
      field: "n_filings",
      width: 100,
      headerText: "Filings",
      description: `
      The number of evictions filed against renters living in a given 

      ${controls.currentSourceHumanReadable}`,
    },
    {
      field: "filing_rate",
      width: 130,
      headerText: "Filing Rate",
      description: `A ratio representing the number of evictions filed for every 100 renters living in a given ${controls.currentSourceHumanReadable}`,
    },
    {
      field: "renter_count",
      width: 150,
      headerText: "Renter Count",
    },
    {
      field: "renter_rate",
      width: 140,
      headerText: "Renter Rate",
    },
    {
      field: "poverty_rate",
      width: 150,
      headerText: "Poverty Rate",
    },
    {
      field: "pct_ai",
      width: 170,
      headerText: "American Indian",
      headerTitle: "Percent American Indian",
    },
    {
      field: "pct_as",
      width: 100,
      headerText: "Asian",
      headerTitle: "Percent Asian",
    },
    {
      width: 100,
      field: "pct_bl",
      headerText: "Black",
      headerTitle: "Percent Black",
    },
    {
      width: 160,
      field: "pct_multi",
      headerText: "Multiple Races",
      headerTitle: "Percent Multiple Races",
    },
    {
      width: 100,
      field: "pct_other",
      headerText: "Other",
      headerTitle: "Percent Other",
    },
    {
      width: 160,
      field: "pct_pi",
      headerText: "Pacific Islander",
      headerTitle: "Percent Pacific Islander",
    },
    {
      width: 100,
      field: "pct_wh",
      headerText: "White",
      headerTitle: "Percent White",
    },
  ],
  rows: computed(
    () => featureProperties
      .featureIds["block-group"]
      .demographic
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
          id: featureId,
          fields: {
            id: {
              value: featureId as unknown as number,
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

function setColumnPin(field: string, pinned: boolean) {
  for (let i = 0; i < columns.value.length; i++) {
    if (columns.value[i].field === field) {
      columns.value[i].pinned = pinned;
      break;
    }
  }
}

const map = await useMap();

onMounted(() => { map.resize() });

const panelWidth = useLocalStorageRef("table-panel-width", window.innerWidth / 2);

function resizePanelWidth(delta: number) {
  const maxWidth = window.innerWidth - 50;
  const newWidth = panelWidth.value + delta;

  if (newWidth < maxWidth) {
    panelWidth.value = newWidth;
    map.resize();
  }
}

const selectedFeatures = computed({
  get() {
    return featureState.selectedFeatures;
  },
  set(rowIds: string[]) {
    featureState._features = rowIds;
  },
});

</script>

<template>
  <div
    class="relative p-4 flex flex-col gap-6 border-r bg-white rounded overflow-hidden"
    :style="{ width: `${panelWidth}px` }"
  >
    <TRCResizeX
      @moveX="resizePanelWidth"
      class="w-2 z-30"
    />
    <h1 class="font-bold text-xl mt-2">
      {{ controls.currentYear }} Eviction and Demographic Data
    </h1>
    <TRCDataTable
      class="max-h-[calc(100%-120px)] rounded bg-white"
      :initalPageSize="20"
      :columns="columns"
      :rows="rows"
      enableSelectAll
      v-model="selectedFeatures"
      @col:pin="({ field, pinned }) => setColumnPin(field, pinned)"
      @row:mouseleave="rowId => featureState.setFeatureState('d_' + rowId, 'isHovered', false)"
      @row:mouseover="rowId => featureState.setFeatureState('d_' + rowId, 'isHovered', 'card')"
      @rows:select="rowIds => featureState._features = rowIds"
    />
  </div>
</template>