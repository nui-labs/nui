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
}

/** CLI command options */
export interface AddCommandOptions {
  /** Target directory for registry items */
  dir?: string;
  /** Overwrite existing items */
  overwrite?: boolean;
  /** Package name to import from */
  package?: string;
}

export interface ListCommandOptions {
  /** Package name to list from */
  package?: string;
  /** Filter by category */
  category?: string;
  /** Filter by type */
  type?: RegistryType;
}
