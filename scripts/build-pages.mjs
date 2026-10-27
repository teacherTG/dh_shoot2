import {build} from 'esbuild';
await build({entryPoints:['pages/main.tsx'],bundle:true,minify:true,format:'esm',platform:'browser',jsx:'automatic',outdir:'docs/assets'});
