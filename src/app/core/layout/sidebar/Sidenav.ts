export interface NavItem {
  name: string;
  icon?: string;
  url?: string;
  isExpanded?: boolean;
  children?: NavItem[];
}

export interface NavItemNode {
  expandable: boolean;
  name: string;
  level: number;
}
