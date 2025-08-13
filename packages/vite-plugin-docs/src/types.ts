/**
 * Plugin configuration options
 */
export interface PluginOptions {
  /** Directory containing documentation content files (default: "src/content") */
  contentsDir?: string;
  /** Directory containing sample components and blocks (default: "src/samples") */
  samplesDir?: string;
  /** Sorting configuration for navigation and content */
  sort?: SortOptions;
  /** Static site generation configuration */
  ssg?: SSGOptions;
}

/**
 * Static site generation configuration
 */
interface SSGOptions {
  /** Enable static site generation (default: false) */
  enabled?: boolean;
  /** Output directory for generated static files (default: "dist") */
  outDir?: string;
}

/**
 * Sorting configuration for content organization
 */
export interface SortOptions {
  /** Array of paths defining the order of navigation items. Use "*" as wildcard for unspecified items */
  order?: string[];
}

/**
 * Represents a parsed content file (markdown, MDX, or TSX)
 */
export interface ContentFile {
  /** Base filename without extension */
  name: string;
  /** Absolute file path */
  filePath: string;
  /** Route path for navigation */
  path: string;
  /** Frontmatter metadata */
  meta: Metadata;
  /** File content (raw for TSX, processed for markdown) */
  content: string;
  /** React component for rendering */
  component: React.ComponentType;
  /** Table of contents extracted from content */
  toc: TocItem[];
  /** Whether this is a TSX file */
  isTsx: boolean;
}

/**
 * Frontmatter metadata for content files
 */
interface Metadata {
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Related links */
  links?: MetadataLink[];
  /** Custom metadata fields */
  [key: string]: unknown;
}

/**
 * Link in metadata
 */
interface MetadataLink {
  /** Link label */
  label: string;
  /** Link URL */
  href: string;
}

/**
 * Table of contents item
 */
export interface TocItem {
  /** Unique identifier for the heading */
  id: string;
  /** Heading text content */
  text: string;
  /** Heading level (1-6) */
  level: number;
}

/**
 * Navigation tree item
 */
export interface NavItem {
  /** Display label */
  label: string;
  /** Route path (if this item is navigable) */
  path?: string;
  /** Associated metadata */
  meta?: Metadata;
  /** Child navigation items */
  items?: NavItem[];
}

/**
 * File within a block directory
 */
export interface BlockFile {
  /** Filename */
  name: string;
  /** Relative path within the block */
  path: string;
  /** File content */
  content: string;
}

/**
 * Block size options
 */
export type BlockSize = "1" | "2" | "3" | "4" | "full";

/**
 * Represents a reusable code block/component
 */
export interface Block {
  /** Unique block identifier */
  id: string;
  /** Display name */
  name: string;
  /** Category for organization */
  category: string;
  /** All files in the block */
  files: BlockFile[];
  /** Route path */
  path: string;
  /** React component for rendering */
  component: React.ComponentType;
  /** Whether this block is featured */
  featured: boolean;
  /** Grid size for layout */
  size: BlockSize;
}

/**
 * Collection of sample components and blocks
 */
export interface Samples {
  /** Sample components */
  components: ContentFile[];
  /** Sample blocks */
  blocks: Block[];
}

/**
 * Parsers turn a file on disk into a typed entity or null if it should be skipped.
 * `rootDir` is used to compute routes and categories relative to a logical base.
 */
export type Parser<T> = (
  filePath: string,
  rootDir: string,
) => Promise<T | null>;
