<script setup lang="ts">
import { useFeatureProperties } from "~/stores/feature-properties-store";
import { dataTableRowsAndCols, type DataTableColumn, type DataTableRow } from "./TRC/DataTable/data-table-types";
import { useMapControls } from "~/stores/map-controls-store";
import { useFeatureState } from "~/stores/feature-state-store";
import { useSettings } from "~/stores/settings-store";

const emit = defineEmits<{
  "resizeX": [delta: number];
}>();

const settings = useSettings();
const controls = useMapControls();
const featureProperties = useFeatureProperties();
const featureState = useFeatureState();

const currentSourceHumanReadable = computed(() => controls.currentSourceHumanReadable?.toLowerCase())

function racePercentageDescription(race: string) {
  return `The percentage of the population of a given ${currentSourceHumanReadable.value} whose race is "${race}" as reported in table P1 published by the U.S. Census Bureau for the 2020 Decennial Census.`;
}


const { columns, rows } = dataTableRowsAndCols({
  columns: [
    {
      field: "id",
      width: 120,
      pinned: true,
      headerText: controls.currentSourceHumanReadable ?? "ID",
      disableSort: true,
      description: controls.currentSourceDesicription
    },
    {
      field: "n_filings",
      width: 90,
      headerText: "Filings",
      description: `The number of evictions filed against renters living in a given ${currentSourceHumanReadable.value}.`,
    },
    {
      field: "filing_rate",
      width: 115,
      headerText: "Filing Rate",
      description: `A ratio representing the number of evictions filed for every 100 renter-occupied households in a given ${currentSourceHumanReadable.value}.`,
    },
    {
      field: "renter_count",
      width: 135,
      headerText: "Renter Count",
      description: `
        The number of renter-occupied households estimated to be in a given ${currentSourceHumanReadable.value}.
        
        This data comes from Table B25008 published by the U.S. Census Bureau as part of the 2022 American Community Survey.
      `,
    },
    {
      field: "renter_rate",
      width: 125,
      headerText: "Renter Rate",
      description: `A ratio representing the number of renter-occupied vs owner-occupied households estimated to be in a given ${currentSourceHumanReadable.value}.`,
    },
    {
      field: "poverty_rate",
      width: 135,
      headerText: "Poverty Rate",
      description: `
        Estimates of the percentage of families in a given ${currentSourceHumanReadable.value} whose income in the past 12 months was below poverty level.
      
        This data comes from Table B17010 published by the U.S. Census Bureau as part of the 2022 American Community Survey.
      `,
    },
    {
      field: "pct_ai",
      width: 155,
      headerText: "American Indian",
      headerTitle: "Percent American Indian",
      description: racePercentageDescription("American Indian"),
    },
    {
      field: "pct_as",
      width: 80,
      headerText: "Asian",
      headerTitle: "Percent Asian",
      description: racePercentageDescription("Asian"),
    },
    {
      width: 80,
      field: "pct_bl",
      headerText: "Black",
      headerTitle: "Percent Black",
      description: racePercentageDescription("Black"),
    },
    {
      width: 140,
      field: "pct_multi",
      headerText: "Multiple Races",
      headerTitle: "Percent Multiple Races",
      description: racePercentageDescription("Multiple Races"),
    },
    {
      width: 80,
      field: "pct_other",
      headerText: "Other",
      headerTitle: "Percent Other",
      description: racePercentageDescription("Other"),
    },
    {
      width: 150,
      field: "pct_pi",
      headerText: "Pacific Islander",
      headerTitle: "Percent Pacific Islander",
      description: racePercentageDescription("Pacific Islander"),
    },
    {
      width: 80,
      field: "pct_wh",
      headerText: "White",
      headerTitle: "Percent White",
      description: racePercentageDescription("White"),
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

</script>

<template>
  <TRCDataTable
    class="max-h-[calc(100%-140px)] rounded bg-white"
    :initalPageSize="20"
    :columns="columns"
    :rows="rows"
    :hoveredRow="featureState.hoveredFeature"
    v-model="featureState.selectedFeatures"
    @col:pin="({ field, pinned }) => setColumnPin(field, pinned)"
    @row:mouseleave="rowId => featureState.setFeatureState(rowId, 'isHovered', false)"
    @row:mouseover="rowId => featureState.setFeatureState(rowId, 'isHovered', 'card')"
    @rows:select="rowIds => featureState._features = rowIds"
  />
</template>

<style>

</style>