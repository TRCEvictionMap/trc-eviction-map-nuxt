require("dotenv").config();

const path = require("path");
const fs = require("fs");

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

function writeGeojsonFile(name, data) {
  fs.writeFileSync(path.resolve("./geojson", `${name}.json`), JSON.stringify(data));
}

async function rpc(fn) {
  const { data, error } = await supabase.rpc(fn);

  if (error) {
    throw error;
  }

  return data;
}

(async () => {
  try {
    writeGeojsonFile("block-group", await rpc("get_block_group_geojson"));
  } catch (error) {
    console.error(error);
  }
})();
