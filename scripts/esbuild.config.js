require("esbuild").build({
  entryPoints: ["./src/index.ts"],
  outdir: "dist",
  bundle: true,
  loader: {".ts": "ts"},
  watch: {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error)
      else console.log('watch build succeeded:', result)
    },
  },
})
.then(() => console.log("⚡ Done"))
.catch(() => process.exit(1));