import { useFeaturePropertiesV2 } from "~/stores/feature-properties-store-v2";
import { useMapControlsV2 } from "~/stores/map-controls-store-v2";

async function useFlyTo() {
  const map = await useMap();
  const featureProperties = useFeaturePropertiesV2();
  const controls = useMapControlsV2();
  return (featureId: string) => {
    let properties:any = undefined!;
    if (controls.currentSource == 'block-group') {
      properties = featureProperties.bgPolygonCenter[featureId];
    }
    else if (controls.currentSource == 'school-district') {
      properties = featureProperties.sdPolygonCenter[featureId];
    }

    if (!properties) {
      return;
    }
    const { size, lon, lat } = properties;
  
    const zoom = (() => {
      if (size > 0.2) return 10.5;
      if (size > 0.15) return 11;
      if (size > 0.05) return 11.5;
      if (size > 0.01) return 13;
      return 14;
    })();

    map.flyTo({ center: [lon, lat], essential: true, zoom });
  }
}

export { useFlyTo };
