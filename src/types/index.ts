
export interface MainNavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  external?: boolean;
  label?: string;
}

export interface NavItemWithChildren extends MainNavItem {
  items: NavItemWithChildren[];
}

export type MainNavItemWithChildren = NavItemWithChildren;
