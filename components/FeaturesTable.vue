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
      field: "renter_count",
      headerText: "Renter Count",
      width: 150
    },
    {
      field: "renter_count_moe",
      headerText: "MOE",
      headerTitle: "Renter count margin of error",
    },
    {
      field: "renter_rate",
      headerText: "Renter Rate",
    },
    {
      field: "renter_rate_moe",
      headerText: "MOE",
      headerTitle: "Renter rate margin of error",
    },
    {
      field: "poverty_rate",
      headerText: "Poverty Rate",
    },
    {
      field: "poverty_rate_moe",
      headerText: "MOE",
      headerTitle: "Poverty rate margin of error",
    },
    {
      field: "n_filings",
      headerText: "Filings"
    },
    {
      field: "filing_rate",
      headerText: "Filing Rate"
    },
    {
      field:"pct_ai",
      headerText: "% American Indian",
      headerTitle: "Percent American Indian",
    },
    {
      field:"pct_as",
      headerText: "% Asian",
      headerTitle: "Percent Asian",
    },
    {
      field:"pct_bl",
      headerText: "% Black",
      headerTitle: "Percent Black",
    },
    {
      field:"pct_multi",
      headerText: "% Multiple Races",
      headerTitle: "Percent Multiple Races",
    },
    {
      field:"pct_other",
      headerText: "% Other",
      headerTitle: "Percent Other",
    },
    {
      field:"pct_pi",
      headerText: "% Pacific Islander",
      headerTitle: "Percent Pacific Islander",
    },
    {
      field:"pct_wh",
      headerText: "% White",
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
            renter_count,
            renter_count_moe,
            renter_rate,
            renter_rate_moe,
            poverty_rate,
            poverty_rate_moe,
            n_filings,
            filing_rate,
            pct_ai,
            pct_as,
            pct_bl,
            pct_multi,
            pct_other,
            pct_pi,
            pct_wh,
          },
        };
      })
  )
});

</script>

<template>
  <div class="w-1/2 relative p-2 flex flex-col">
    <!-- <MapControls class="relative" /> -->
    <TRCDataTable :columns="columns" :rows="rows">
      <template #row="{ row }">
        <tr
          @mouseover="() => featureState.setFeatureState('d_' + row.id, 'isHovered', 'card')"
          @mouseleave="() => featureState.setFeatureState('d_' + row.id, 'isHovered', false)"
        >
          <td scope="col" class="sticky z-10 left-0 bg-slate-100  shadow-slate-950 py-1 px-2">
            {{ row.id }}
          </td>
          <td v-for="column in columns" :key="column.field" class="px-4" >
            {{ row.fields[column.field] }}
          </td>
        </tr>
      </template>
    </TRCDataTable>
  </div>
</template>