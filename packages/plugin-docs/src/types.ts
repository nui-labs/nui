/**
 * Plugin configuration options
 */
export interface PluginOptions {
  /** Directory containing documentation pages (default: "src/pages") */
  contentsDir?: string;
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
