"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { useAppStore } from "@/store";

import { useMemo, ReactNode } from "react";

/**
 * Navigation
 *
 * Responsive primary navigation:
 * - Mobile (< md): fixed bottom tab bar
 * - Desktop (>= md): fixed left sidebar
 *
 * Tabs (Plan A):
 *  - Dashboard (/dashboard)
 *  - Team (/pokemon)
 *  - Trainer (/trainer)
 *
 * Badges:
 *  - Team: current count / 6
 *  - Trainer: Lv.X or "Set Up" if no trainer exists
 *
 * Accessibility:
 *  - <nav aria-label="Main">
 *  - Each active link has aria-current="page"
 *  - Labels always visible (no icon-only state)
 */

interface NavItemConfig {
  key: string;

  label: string;

  href: string;

  icon: ReactNode;
  badge?: string | null;

  isActive: (pathname: string) => boolean;
}

/* ---------- Icons (inline, lightweight) ---------- */

const IconDashboard = (props: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className ?? "w-5 h-5"}
  >
    <path d="M3 13h8V3H3v10Zm10 8h8V11h-8v10ZM3 21h8v-6H3v6Zm10-12h8V3h-8v6Z" />
  </svg>
);

const IconTeam = (props: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className ?? "w-5 h-5"}
  >
    <circle cx="8" cy="8" r="3" />
    <circle cx="16" cy="8" r="3" />
    <path d="M2 20c.2-3.4 2.8-6 6-6s5.8 2.6 6 6M10 20c.2-3.4 2.8-6 6-6 3.2 0 5.8 2.6 6 6" />
  </svg>
);

const IconTrainer = (props: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className ?? "w-5 h-5"}
  >
    <circle cx="12" cy="7" r="4" />
    <path d="M5 21c.5-4 3.5-6 7-6s6.5 2 7 6" />
  </svg>
);

/* ---------- Utility: derive active segment ---------- */

const getPrimarySegment = (pathname: string): string => {
  if (!pathname || pathname === "/") return "dashboard";
  const parts = pathname.split("/").filter(Boolean);
  // Map redirect root → dashboard already handled outside; treat unknown as first segment.
  return parts[0];
};

/* ---------- Component ---------- */

export default function Navigation() {
  const pathname = usePathname();

  // Narrow store selection; compute counts directly
  const pokemonTeam = useAppStore.use.pokemonTeam();
  const pokemonCount = Object.keys(pokemonTeam).length;
  const trainer = useAppStore.use.trainer();

  const teamBadge = `${pokemonCount}/6`;
  const trainerBadge = trainer ? `Lv ${trainer.level}` : "Set Up";

  const items: NavItemConfig[] = useMemo(
    () => [
      {
        key: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: <IconDashboard />,
        isActive: (p) => getPrimarySegment(p) === "dashboard",
      },
      {
        key: "pokemon",
        label: "Team",
        href: "/pokemon",
        icon: <IconTeam />,
        badge: teamBadge,
        isActive: (p) => getPrimarySegment(p) === "pokemon",
      },
      {
        key: "trainer",
        label: "Trainer",
        href: "/trainer",
        icon: <IconTrainer />,
        badge: trainerBadge,
        isActive: (p) => getPrimarySegment(p) === "trainer",
      },
    ],
    [teamBadge, trainerBadge],
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <nav
        aria-label="Main"
        className="hidden md:flex fixed left-0 top-0 h-screen w-52 flex-col gap-2 px-3 py-6
          bg-gradient-to-b from-black/30 to-black/20 backdrop-blur-xl border-r border-white/10
          text-sm z-40"
      >
        <div className="px-2 mb-4">
          <span className="text-xs font-semibold tracking-wide text-white/40">
            NAVIGATION
          </span>
        </div>
        <ul className="flex flex-col gap-1">
          {items.map((item) => {
            const active = item.isActive(pathname);
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${
                      active
                        ? "bg-white/15 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                >
                  {/* Active indicator bar */}
                  <span
                    className={`absolute left-0 top-0 h-full w-1 rounded-tr rounded-br transition-opacity
                      ${
                        active
                          ? "bg-blue-400 opacity-100"
                          : "bg-transparent opacity-0 group-hover:opacity-40"
                      }`}
                    aria-hidden="true"
                  />
                  <span
                    className={`shrink-0 ${
                      active
                        ? "text-white"
                        : "text-gray-300 group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold
                        ${
                          active
                            ? "bg-blue-500/30 text-blue-100"
                            : "bg-white/10 text-gray-300 group-hover:bg-white/20"
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* To avoid content under sidebar on desktop */}
      <div className="hidden md:block w-52 shrink-0" aria-hidden="true" />

      {/* Mobile Bottom Bar */}
      <nav
        aria-label="Main"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40
          bg-gradient-to-t from-black/60 to-black/40 backdrop-blur-xl
          border-t border-white/10"
      >
        <ul className="flex justify-around items-stretch">
          {items.map((item) => {
            const active = item.isActive(pathname);
            return (
              <li key={item.key} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium
                    transition-colors ${
                      active ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                >
                  <span
                    className={`${
                      active
                        ? "text-white"
                        : "text-gray-300/80 group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] leading-none font-semibold mt-0.5 px-1.5 py-0.5 rounded
                        ${
                          active
                            ? "bg-blue-500/30 text-blue-100"
                            : "bg-white/10 text-gray-300"
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        {/* Safe area spacer */}
        <div className="h-[env(safe-area-inset-bottom)]" aria-hidden="true" />
      </nav>
    </>
  );
}

/* Potential future optimization:
 * - Extract a narrower selector for team count (e.g. store.pokemonTeamKeys) to avoid re-renders
 *   when unrelated Pokémon data changes. If needed, expose such a selector in the store util.
 */
