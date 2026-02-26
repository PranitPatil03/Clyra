"use client";

import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { logout } from "@/lib/api";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ElementType, useState } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Results", href: "/dashboard/results" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useCurrentUser();

  const displayName = user?.displayName || user?.name || "";
  const email = user?.email || "";
  const profilePicture = user?.profilePicture || user?.image || "";

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="bg-[#f8fafc] text-gray-900 h-full flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link
          href="/dashboard"
          className="text-xl font-medium tracking-tight text-gray-900"
          onClick={onNavigate}
        >
          Clyra
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-grow p-4 mt-2">
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

      {/* User Profile at bottom */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/60 transition-all duration-200 cursor-pointer text-left">
                <Avatar className="size-9 shrink-0 border border-gray-200">
                  <AvatarImage src={profilePicture} />
                  <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-sm font-medium">
                    {displayName?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {displayName || "User"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{email}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              className="w-56 mb-1 rounded-xl"
            >
              <DropdownMenuItem className="flex flex-col items-start py-2.5 cursor-default">
                <span className="text-sm font-medium text-gray-900">
                  {displayName}
                </span>
                <span className="text-xs text-gray-400">{email}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <User className="size-4 text-gray-500" />
                  <span>Account Info</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
              >
                <LogOut className="size-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
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
  const isActive = path === link.href;

  return (
    <li key={link.label}>
      <Link
        href={link.href}
        target={link.target}
        onClick={onNavigate}
        className={cn(
          "group flex h-10 items-center gap-x-3 rounded-xl px-3 text-sm font-medium leading-5 text-gray-500 transition-all duration-200",
          isActive
            ? "bg-white text-gray-900 shadow-sm border border-gray-200/80"
            : "hover:bg-white/60 hover:text-gray-900"
        )}
      >
        <link.icon
          className={cn(
            "size-4 shrink-0 transition-colors",
            isActive
              ? "text-orange-500"
              : "text-gray-400 group-hover:text-gray-600"
          )}
        />
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
    <div className="flex h-screen bg-[#f8fafc]">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="bg-white shadow-sm border-gray-200 rounded-xl"
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
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-[#f8fafc] text-gray-900 w-[220px] min-h-screen transition-transform duration-200",
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
