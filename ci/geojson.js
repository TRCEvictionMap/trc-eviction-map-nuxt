require("dotenv").config();

const path = require("path");
const fs = require("fs");

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

function writeGeojson(name, data) {
  fs.writeFileSync(
    path.resolve("./geojson", `${name}.json`),
    JSON.stringify(data)
  );
}

async function rpc(fn) {
  console.info("[rpc]", fn);

  const { data, error } = await supabase.rpc(fn);

  if (error) {
    throw error;
  }

  return data;
}

function isFeatureCollection(data) {
  return data.type === "FeatureCollection" && Array.isArray(data.features);
}

function validate(data) {
  if (!isFeatureCollection(data)) {
    throw new Error("Invalid FeatureCollection");
  }

  return data;
}

async function pullGeoJSON() {
  try {
    console.info("[pullGeoJSON] Begin");
    writeGeojson("block-group", validate(await rpc("get_block_group_geojson")));
  } catch (error) {
    console.error("[pullGeoJSON]", error);
  } finally {
    console.info("[pullGeoJSON] Complete");
  }
}

pullGeoJSON();
