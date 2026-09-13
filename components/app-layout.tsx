"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Bell,
  Search,
  Sun,
  Moon,
  ArrowUpRight,
  Command,
  Grid2X2,
} from "lucide-react";
import { Brand, navigation } from "@/components/sidebar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const current = navigation.find((n) => n.path === pathname);
  useEffect(() => {
    setSearch(false);
    setQuery("");
  }, [pathname]);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setSearch((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  const matches = navigation.filter((n) =>
    n.label.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="workspace-app">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="workspace-toolbar">
        <Brand />
        <nav className="workspace-primary-nav" aria-label="Primary navigation">
          {navigation.slice(0, 5).map((n) => (
            <Link
              key={n.path}
              href={n.path}
              aria-current={pathname === n.path ? "page" : undefined}
            >
              {n.label}
            </Link>
          ))}
          <button onClick={() => setSearch(true)} className="all-tools-control">
            <Grid2X2 size={14} />
            All tools
          </button>
        </nav>
        <div className="toolbar-actions">
          <button
            className="icon-control mobile-menu"
            aria-label="Open navigation"
            onClick={() => setSearch(true)}
          >
            <Grid2X2 size={18} />
          </button>
          <button
            className="toolbar-search"
            aria-label="Search pages"
            onClick={() => setSearch(true)}
          >
            <Search size={16} />
            <kbd>⌘ K</kbd>
          </button>
          <button
            className="icon-control"
            aria-label="Toggle color theme"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <Sun className="theme-sun" size={16} />
            <Moon className="theme-moon" size={16} />
          </button>
          <Link
            href="/expiry-alerts"
            aria-label="View expiry alerts"
            className="icon-control"
          >
            <Bell size={16} />
          </Link>
          <Link
            href="/staff-accounts"
            className="toolbar-avatar"
            aria-label="Manage staff accounts"
          >
            M
          </Link>
        </div>
      </header>
      <div className="workspace-main">
        <div className="workspace-context">
          <span>
            Workspace <span className="context-slash">/</span>{" "}
            {current?.label || "Records"}
          </span>
          {process.env.NEXT_PUBLIC_DEPLOYMENT_MODE === "demo" && (
            <span className="workspace-mode">
              <span className="status-dot" />
              Demo data
            </span>
          )}
        </div>
        <main id="main-content" tabIndex={-1} className="workspace-content">
          {children}
        </main>
      </div>
      <Dialog open={search} onOpenChange={setSearch}>
        <DialogContent className="page-search-dialog">
          <DialogTitle className="sr-only">Navigate workspace</DialogTitle>
          <DialogDescription className="sr-only">
            Search and open a MedInv page.
          </DialogDescription>
          <div className="command-search-field">
            <Search size={19} />
            <Input
              autoFocus
              aria-label="Search workspace pages"
              placeholder="Where do you want to go?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="page-search-results">
            {matches.map((n) => (
              <Link
                key={n.path}
                href={n.path}
                onClick={() => {
                  setSearch(false);
                  setQuery("");
                }}
              >
                <n.icon size={17} />
                <span>
                  {n.label}
                  <small>{n.group}</small>
                </span>
                <ArrowUpRight size={14} />
              </Link>
            ))}
            {!matches.length && (
              <p className="search-empty">No pages match “{query}”.</p>
            )}
          </div>
          <div className="search-hint">
            <span>
              <Command size={12} /> Workspace navigation
            </span>
            <span>Esc to close</span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
