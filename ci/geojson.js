require("dotenv").config();

const path = require("path");
const fs = require("fs");

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SRVC_KEY,
);

function writeGeojson(name, data) {
  const dir = "./public";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const file = path.resolve(dir, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data));
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
    writeGeojson(
      "block-group-heatmap",
      validate(await rpc("get_block_group_heatmap")),
    );
  } catch (error) {
    console.error("[pullGeoJSON]", error);
  } finally {
    console.info("[pullGeoJSON] Complete");
  }
}

pullGeoJSON();
