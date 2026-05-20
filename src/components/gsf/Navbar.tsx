"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Menu, X, ChevronDown, Globe, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { key: "about", href: "/about" },
  {
    key: "programmes",
    href: "/programmes",
    children: [
      { key: "programmes", href: "/programmes" },
      { key: "bootCamp", href: "/programmes/boot-camp" },
    ],
  },
  {
    key: "players",
    href: "/players",
    children: [
      { key: "players", href: "/players" },
      { key: "alumni", href: "/alumni" },
    ],
  },
  { key: "competitions", href: "/competitions" },
  {
    key: "media",
    href: "/media",
    children: [
      { key: "media", href: "/media" },
      { key: "gallery", href: "/media/gallery" },
      { key: "news", href: "/media" },
    ],
  },
  { key: "partners", href: "/partners" },
  { key: "contact", href: "/contact" },
] as const;

function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const switchedPath = pathname.replace(`/${locale}`, `/${locale === "fr" ? "en" : "fr"}`);

  return (
    <Link
      href={switchedPath}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors"
    >
      <Globe className="h-3 w-3" />
      {locale === "fr" ? "EN" : "FR"}
    </Link>
  );
}

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const isActive = (href: string) => {
    const full = `/${locale}${href}`;
    return pathname === full || (href !== "/" && pathname.startsWith(full));
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container-gsf">
        <nav className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 shrink-0"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white font-display font-bold text-xs shrink-0">
              GSF
            </div>
            <div className={cn(
              "hidden sm:block leading-tight transition-colors",
              scrolled ? "text-foreground" : "text-white"
            )}>
              <p className="font-display font-bold text-sm tracking-wide">
                Genius Soccer
              </p>
              <p className="text-xs font-semibold text-primary">Foundation</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              const hasChildren = "children" in link && link.children;

              if (hasChildren) {
                return (
                  <li
                    key={link.key}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.key)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button className={cn(
                      "flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      scrolled
                        ? active ? "text-primary bg-primary/5" : "text-foreground hover:text-primary hover:bg-primary/5"
                        : active ? "text-primary" : "text-white/90 hover:text-white"
                    )}>
                      {t(link.key as any)}
                      <ChevronDown className={cn(
                        "h-3.5 w-3.5 transition-transform duration-200",
                        openDropdown === link.key && "rotate-180"
                      )} />
                    </button>

                    {openDropdown === link.key && (
                      <div className="absolute top-full left-0 pt-1 min-w-[180px]">
                        <div className="rounded-xl border border-border bg-white shadow-elegant py-1.5">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={`/${locale}${child.href}`}
                              className={cn(
                                "block px-4 py-2.5 text-sm transition-colors hover:bg-primary/5 hover:text-primary",
                                isActive(child.href) ? "text-primary font-semibold" : "text-foreground"
                              )}
                            >
                              {t(child.key as any)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={link.key}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className={cn(
                      "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      scrolled
                        ? active ? "text-primary bg-primary/5" : "text-foreground hover:text-primary hover:bg-primary/5"
                        : active ? "text-primary" : "text-white/90 hover:text-white"
                    )}
                  >
                    {t(link.key as any)}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <LangSwitcher />
            <Link
              href={`/${locale}/join`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-elegant hover:bg-primary-dark transition-colors"
            >
              {t("join")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Burger mobile */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(
              "lg:hidden p-2 rounded-md transition-colors",
              scrolled ? "text-foreground hover:bg-accent" : "text-white hover:bg-white/10"
            )}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white/98 backdrop-blur-md">
          <div className="container-gsf py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <div key={link.key}>
                <Link
                  href={`/${locale}${link.href}`}
                  className={cn(
                    "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive(link.href)
                      ? "text-primary bg-primary/5 font-semibold"
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {t(link.key as any)}
                </Link>
                {"children" in link && link.children &&
                  link.children
                    .filter((c) => c.href !== link.href)
                    .map((child) => (
                      <Link
                        key={child.href}
                        href={`/${locale}${child.href}`}
                        className={cn(
                          "block pl-6 pr-3 py-2 text-sm transition-colors",
                          isActive(child.href)
                            ? "text-primary font-semibold"
                            : "text-muted-foreground hover:text-primary"
                        )}
                      >
                        {t(child.key as any)}
                      </Link>
                    ))}
              </div>
            ))}
            <div className="pt-3 border-t border-border flex items-center gap-3">
              <LangSwitcher />
              <Link
                href={`/${locale}/join`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
              >
                {t("join")} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
