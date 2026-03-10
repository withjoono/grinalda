import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { buttonVariants } from "./custom/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SubSidebarNav({ className, items, ...props }: SidebarNavProps) {
  const nav = useLocation();
  return (
    <nav
      className={cn(
        "flex gap-y-2 space-x-2 overflow-x-scroll scrollbar-hide lg:sticky lg:top-20 lg:flex-col lg:space-x-0 lg:space-y-1",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            nav.pathname.startsWith(item.href)
              ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
