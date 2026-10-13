"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/time-entries", label: "Time entries" },
  { href: "/clients", label: "Clients" },
];

function MemtimeMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn("h-5 w-5 shrink-0 text-primary", className)}
      fill="none"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border/80 bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-8 px-4">
        <Link
          href="/time-entries"
          className="font-display flex items-center gap-2 text-base font-semibold tracking-tight text-foreground"
        >
          <MemtimeMark />
          memtime
        </Link>
        <nav className="flex gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                )}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute inset-x-2 -bottom-[9px] h-0.5 rounded-full bg-primary"
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
