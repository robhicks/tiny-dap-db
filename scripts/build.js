import { build } from 'esbuild'

build({
  bundle: true,
  entryPoints: ["./src/Core.ts"],
  format: 'esm',
  outdir: "dist",
  splitting: true,
   platform: "node",
  target: ['esnext'],
  watch: false,
})
.then(() => console.log("⚡ Done"))

