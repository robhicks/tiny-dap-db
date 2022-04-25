import { build } from "esbuild";
import glob from "glob";

const entryPoints = glob.sync("./src/**/*.ts");

// console.log(`entryPoints`, entryPoints)

build({
  entryPoints,
  format: "esm",
  outdir: "dist",
  target: ["esnext"],
  platform: "node",
  bundle: true,
  watch: {
    onRebuild(error, result) {
      if (error) console.error("watch build failed:", error);
      else console.log("watch build succeeded: ⚡ Done", result);
    },
  },
}).then(() => console.log("watching ..."));
