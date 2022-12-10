import type { PreRenderedAsset, PreRenderedChunk } from "rollup";

/**
 * Mapping table item replacer callback function type
 */
export type MappingItemCallbackReplacerType = (match: string, ...args: any[]) => string;

/**
 * Mapping table item data type
 */
export type MappingItemType = { expression: RegExp, replacer: MappingItemCallbackReplacerType|string };

/**
 * Map the chunk/asset filenames using a regular expression based mapping table
 * 
 * If you want to group chunks, please use the mapManualChunkNames instead
 * 
 * @param itemInfo Chunk/asset item details
 * @param mappingTable Chunks/assets mapping table
 * @param defaultOutputPath Default chunks/assets output path (default: assets)
 * @returns Computed chunk/asset item output filename
 */
export const mapChunkOrAssetFileNames = (itemInfo: PreRenderedAsset|PreRenderedChunk, mappingTable: MappingItemType[], defaultOutputPath?: string): string => {
  defaultOutputPath = defaultOutputPath || "assets";

  if(itemInfo.name) {
    // Try to find a rule that matches the chunk/asset in the mapping table
    for(let i = 0; i < mappingTable.length; i++) {
      if(mappingTable[i].expression.test(itemInfo.name)) {
        if(typeof(mappingTable[i].replacer) == "string")
          return mappingTable[i].replacer as string;
        else if (typeof(mappingTable[i].replacer) == "function")
          return itemInfo.name.replace(mappingTable[i].expression, mappingTable[i].replacer as MappingItemCallbackReplacerType);
        else
          throw "Unknown chunks/assets mapping replacement type, must be a string or a function";
      }
    }
  }

  // Fallback to the default chunk/asset location/file format
  return `${defaultOutputPath}/[name]-[hash][extname]`.replace(/^\+/, "");
}

/**
 * Map the manual chunk names using a regular expression based mapping table
 * 
 * If you want to map assets filenames, please use the mapChunkOrAssetFileNames instead
 * 
 * @param id Chunk item full path
 * @param mappingTable Manual chunks mapping table
 * @returns Computed manual chunk output filename
 */
export const mapManualChunkNames = (id: string, mappingTable: MappingItemType[]): string|undefined => {
  var moduleName = id.replace(/\\/g, "/").replace(process.cwd().replace(/\\/g, "/"), "").replace(/^\//, "");
  for(let i = 0; i < mappingTable.length; i++) {
    if(mappingTable[i].expression.test(moduleName)) {
      if(typeof(mappingTable[i].replacer) == "string")
        return mappingTable[i].replacer as string;
      else if (typeof(mappingTable[i].replacer) == "function")
        return moduleName.replace(mappingTable[i].expression, mappingTable[i].replacer as MappingItemCallbackReplacerType);
      else
        throw "Unkown chunks map replacement type, must be a string or a function";
    }
  }
  return undefined;
}
