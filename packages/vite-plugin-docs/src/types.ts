export interface PluginOptions {
  contentsDir?: string;
  demosDir?: string;
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
