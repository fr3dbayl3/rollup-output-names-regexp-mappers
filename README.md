# rollup-output-names-regexp-mappers

Simple Rollup output filenames mappers that uses regular expressions

## Installation

``` bash
npm install -D rollup-output-names-regexp-mappers
```

## Creating mapping tables

### Defining mapping tables

``` typescript
// mapping-tables.ts
import type { MappingItemType } from "rollup-output-names-regexp-mappers";

// Asset mapping table example
export const assetsMap: MappingItemType[] = [
  { // You can replace filename with a string
    expression: /.css$/i, 
    replacer: "assets/css/[name]-[hash][extname]" 
  },
  { // You can replace filename with a callback function
    expression: /([^\/]+)\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i, 
    replacer: (_, name, ext) => `assets/css/${name}-[hash].${ext}`
  }
]

// Manual chunk mapping table example
export const manualChunksMap: MappingItemType[] = [
  { // You can replace manual chunknames with a string
    expression: /^node_modules\/(@?vue(-router)?|pinia)\//i, 
    replacer: "vendors/vue" 
  },
  { 
    expression: /^node_modules\//i, 
    replacer: "vendors/others" 
  },
  { // You can replace manual chunknames with a callback function
    expression: /^src\/components\/(.+\/)?([^\.]+?)\.vue.*/i, 
    replacer: (_, path, name) => `components/${path}${name}` 
  }
]
```

### Updating your rollup configuration

``` typescript
// rollup.config.ts
import { fileURLToPath } from 'node:url'
import { mapChunkOrAssetFileNames, mapManualChunkNames } from 'rollup-output-names-regexp-mappers';
import { manualChunksMap, assetsMap } from './vite-chunks';

export default {
  ...,
  output: {
    ...,
    assetFileNames: assetInfo => mapChunkOrAssetFileNames(assetInfo, assetsMap),
    manualChunks: id => mapManualChunkNames(id, manualChunksMap)
  }
};
```

### Result

```
dist
|-- assets
|   |-- css
|   |   |-- styles-abc123456.css
|   |   
|   |-- img
|   |   |-- my-picture-abc123456.jpg
|   |
|   |-- vendors
|       |-- vue-abc123456.js
|   
```
