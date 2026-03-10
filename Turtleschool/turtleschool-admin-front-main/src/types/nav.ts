export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon: JSX.Element;
  label?: string;
  description?: string;
}
