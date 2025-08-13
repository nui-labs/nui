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
  size?: number;
  lastModified?: Date;
}

export interface BlockPreview {
  component: string;
  props?: Record<string, any>;
  width?: "sm" | "md" | "lg" | "xl" | "full";
  height?: "sm" | "md" | "lg" | "xl" | "auto";
  background?: "default" | "muted" | "card" | "transparent";
  padding?: "none" | "sm" | "md" | "lg";
}

export interface BlockConfig {
  name: string;
  description: string;
  category: string;
  tags?: string[];
  preview: BlockPreview;
  dependencies?: string[];
  meta?: Partial<Metadata>;
  featured?: boolean;
  difficulty?: "beginner" | "intermediate" | "advanced";
  version?: string;
  author?: string;
  license?: string;
}

export interface Block {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  files: BlockFile[];
  preview: BlockPreview;
  dependencies: string[];
  meta: Metadata;
  path: string;
  component: React.ComponentType;
  featured: boolean;
  difficulty: "beginner" | "intermediate" | "advanced";
  version: string;
  author?: string;
  license?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
