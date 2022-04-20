import { build } from 'esbuild'
import glob from 'glob'

const entryPoints = glob.sync("./src/**/*.ts")

console.log(`entryPoints`, entryPoints)

build({
  entryPoints,
  format: 'esm',
  outdir: "dist",
  target: ['esnext'],
  platform: "node",
  bundle: true,
  watch: true,
})
.then(() => console.log("⚡ Done"))

