export interface PluginOptions {
  contentsDir?: string;
  demosDir?: string;
  blocksDir?: string;
  sort?: SortOptions;
  ssg?: SSGOptions;
}

export interface SortOptions {
  order?: string[];
}

export interface SSGOptions {
  enabled?: boolean;
  outDir?: string;
}

export interface ContentFile {
  name: string;
  filePath: string;
  path: string;
  meta: Metadata;
  content: string;
  component: React.ComponentType;
  toc: TocItem[];
  isTsx: boolean;
}

export interface Metadata {
  title?: string;
  description?: string;
  links?: Array<{
    label: string;
    href: string;
  }>;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface NavItem {
  label: string;
  path?: string;
  meta?: Metadata;
  items?: NavItem[];
}

export interface BlockFile {
  name: string;
  path: string;
  content: string;
  language: string;
  type: "component" | "utility" | "type" | "config" | "style";
}

export interface BlockPreview {
  component: string;
  props?: Record<string, any>;
}

export interface BlockConfig {
  name: string;
  featured?: boolean;
  size?: string; // Simplified to string for "1", "2", "1:1", "2:1", etc.
}

export interface Block {
  id: string;
  name: string;
  category: string;
  tags: string[];
  files: BlockFile[];
  preview: BlockPreview;
  path: string;
  component: React.ComponentType;
  featured: boolean;
  size: string; // Simplified to string for flexible sizing
  createdAt?: Date;
  updatedAt?: Date;
}
