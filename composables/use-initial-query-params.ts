import { type EvictionMetric, type DemographicMetric, isDemographicMetric, isEvictionMetric } from "~/stores/map-controls-store";
import { type SourceId, isSourceId } from "~/utils/types";


interface QueryParams {
  _showDetails: boolean;
  _showHeatmap: boolean;
  _lngLat: [number, number];
  _zoom: number;
  _year: string;
  _dates?: [string, string];
  _source: SourceId;
  _e_metric: EvictionMetric;
  _d_metric: DemographicMetric;
  _features: string[];
}

function useInitialQueryParams(): QueryParams {
  const route = useRoute();

  let _lngLat: QueryParams["_lngLat"] = [-89.390, 43.1];
  let _zoom: QueryParams["_zoom"] = 10.8;
  let _source: QueryParams["_source"] = "block-group";
  let _year: QueryParams["_year"] = "2023";
  let _d_metric: QueryParams["_d_metric"] = "renter_count";
  let _e_metric: QueryParams["_e_metric"] = "n_filings";
  let _features: QueryParams["_features"] = [];
  let _showDetails: QueryParams["_showDetails"] = false;
  let _showHeatmap: QueryParams["_showHeatmap"] = true;

  let _dates: QueryParams["_dates"];

  const { center, zoom, source, year, d_metric, e_metric, features, showDetails, dates, heatmap } = route.query;

  if (center) {
    const [lng, lat] = (route.query.center as string).split(",");
    _lngLat = [
      Number.parseFloat(lng),
      Number.parseFloat(lat),
    ];
  }

  if (zoom) {
    _zoom = Number.parseFloat(zoom as string);
  }

  if (typeof year === "string" && /^\d{4}$/.test(year.trim())) {
    _year = year.trim();
  }

  if (isSourceId(source)) {
    _source = source;
  }

  if (isDemographicMetric(d_metric)) {
    _d_metric = d_metric;
  }

  if (isEvictionMetric(e_metric)) {
    _e_metric = e_metric;
  }

  if (typeof features === "string") {
    _features = features.split(",");
  }

  if (typeof showDetails === "string") {
    _showDetails = ["t", "true"].includes(showDetails.toLowerCase()) && _features.length > 0;
  }

  if (typeof heatmap === "string") {
    _showHeatmap = ["t", "true"].includes(heatmap.toLowerCase());
  }

  if (typeof dates === "string" && /^\d{4}-\d{1,2},\d{4}-\d{1,2}$/.test(dates)) {
    const [start, end] = dates.split(",");
    _dates = [start, end];
  }

  return { _lngLat, _zoom, _source, _year, _d_metric, _e_metric, _features, _showDetails, _dates, _showHeatmap };
}

export { useInitialQueryParams };
