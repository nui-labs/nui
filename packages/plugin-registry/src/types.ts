export interface PluginOptions {
  /** Directory containing registry files */
  registryDir?: string;
  /** Output directory for registry JSON file */
  registryOutput?: string;
}

/** Individual file within a registry item */
export interface RegistryFile {
  name: string;
  path: string;
  content: string;
  language: string;
}

/**
 * Registry item type based on complexity and purpose
 * - block: Multi-file blocks with meta
 * - component: Simple, single-file component examples
 */
export type RegistryType = "block" | "component";

/** Core registry item metadata */
export interface RegistryMetadata {
  id: string;
  name: string;
  description: string;
  category: string;
  type: RegistryType;
  updatedAt: string;
  tags?: string[];
}

/** Registry item with files and runtime properties */
export interface RegistryItem extends RegistryMetadata {
  files: RegistryFile[];
  dependencies: string[];
  size?: string;
  path?: string;
  component?: React.ComponentType;
}
