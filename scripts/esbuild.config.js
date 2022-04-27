import esbuildServe from "esbuild-serve";
import glob from "glob";

const entryPoints = glob.sync("./src/**/*.ts");

esbuildServe(
  {
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
  },
  {
    // serve options (optional)
    port: 7001,
    root: ".",
  }
);
