export interface PluginOptions {
  /** Directory to scan for blocks */
  blocksDir?: string;
  /** Block discovery patterns */
  patterns?: string[];
  /** Registry JSON output path */
  registryOutput?: string;
}

/** Individual file within a block */
export interface BlockFile {
  name: string;
  path: string;
  content: string;
  language: string;
}

/** Core block metadata */
export interface BlockMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  updatedAt: string;
}

/** Block with files and runtime properties */
export interface Block extends BlockMetadata {
  files: BlockFile[];
  dependencies: string[];
  size?: string;
  path?: string;
  component?: React.ComponentType;
}
