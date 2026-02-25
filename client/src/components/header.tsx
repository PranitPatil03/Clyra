"use client";

import Link from "next/link";
import { UserButton } from "./shared/user-button";

export function Header() {
  return (
    <header className="absolute px-6 top-0 z-50 w-full bg-transparent">
      <div className="container mx-auto flex h-20 max-w-6xl items-center justify-between">
        <Link
          href={"/"}
          className="text-2xl font-medium tracking-tight text-gray-900"
        >
          Clyra
        </Link>
        <UserButton />
      </div>
    </header>
  );
}
