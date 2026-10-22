import { useFeaturePropertiesV2 } from "~/stores/feature-properties-store-v2";

async function useFlyTo() {
  const map = await useMap();
  const featureProperties = useFeaturePropertiesV2();

  return (featureId: string) => {
    const properties = featureProperties.bgPolygonCenter[featureId];

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
