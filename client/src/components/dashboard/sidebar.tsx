"use client";

import { cn } from "@/lib/utils";
import {
  FileText,
  Home,
  LayoutDashboard,
  Menu,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ElementType, useState } from "react";
import { Button } from "../ui/button";

const sidebarItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Results", href: "/dashboard/results" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname();

  return (
    <div className="bg-white text-black h-full flex flex-col">
      <div className="p-6 border-b">
        <Link
          href="/"
          className="text-xl font-medium tracking-tight"
          onClick={onNavigate}
        >
          Clyra
        </Link>
      </div>
      <nav className="flex-grow p-6">
        <ul role="list" className="flex flex-col flex-grow">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {sidebarItems.map((item) => (
                <Navlink
                  key={item.label}
                  path={pathname}
                  link={item}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const Navlink = ({
  path,
  link,
  onNavigate,
}: {
  path: string;
  link: {
    icon: ElementType;
    label: string;
    href: string;
    target?: string;
  };
  onNavigate?: () => void;
}) => {
  return (
    <li key={link.label}>
      <Link
        href={link.href}
        target={link.target}
        onClick={onNavigate}
        className={cn(
          "group flex h-9 items-center gap-x-3 rounded-md px-3 text-sm font-semibold leading-5 text-black",
          path === link.href ? "bg-gray-200" : "hover:bg-gray-200"
        )}
      >
        <link.icon className="size-4 shrink-0" />
        {link.label}
      </Link>
    </li>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-[4.5rem] left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="bg-white shadow-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="size-4" />
          ) : (
            <Menu className="size-4" />
          )}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white text-black border-r border-gray-200 w-[280px] min-h-screen transition-transform duration-200",
          isMobileMenuOpen
            ? "fixed z-50 translate-x-0"
            : "hidden lg:block lg:relative"
        )}
      >
        <SidebarContent onNavigate={() => setIsMobileMenuOpen(false)} />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
