"use client";
import { useEffect, useMemo, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Compass, Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/lost", label: "Lost" },
  { href: "/found", label: "Found" },
  { href: "/how-it-works", label: "How It Works" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isAuthenticated = status === "authenticated";
  const userImage = session?.user?.image ?? "https://github.com/shadcn.png";

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  const isActive = useMemo(
    () => (href: string) => pathname === href || (href !== "/" && pathname?.startsWith(`${href}/`)),
    [pathname],
  );

  return (
    <header className="fi-frosted sticky top-0 z-50 border-b border-white/50 bg-white/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 md:h-[74px] md:px-8">
        <Link href="/" className="shrink-0" aria-label="Go to home">
          <h1 className="flex items-center gap-2 text-xl font-extrabold text-slate-900 md:text-3xl">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm md:h-9 md:w-9">
              <Compass className="h-4 w-4" />
            </span>
            FindIt
          </h1>
        </Link>

        <ul className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition",
                  isActive(link.href) ? "bg-orange-100 text-orange-700" : "text-slate-600 hover:bg-white hover:text-orange-600",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/new-lost"
              className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Post Item
            </Link>
          </li>
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="ring-2 ring-white shadow-sm">
                  <AvatarImage src={userImage} />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 w-44 rounded-xl border-slate-200 bg-white/95">
                <DropdownMenuItem>
                  <Link href="/account">My Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/api/auth/signout">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/api/auth/signin"
              className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm transition hover:bg-orange-50"
            >
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-700 ring-orange-500 transition hover:bg-orange-100/70 focus:outline-none focus:ring md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div className={cn("md:hidden", menuOpen ? "pointer-events-auto" : "pointer-events-none")} id="mobile-nav-panel">
        <button
          type="button"
          aria-label="Close mobile menu"
          className={cn("fixed inset-0 z-40 bg-slate-900/30 transition-opacity", menuOpen ? "opacity-100" : "opacity-0")}
          onClick={closeMenu}
        />

        <div
          className={cn(
            "absolute left-0 right-0 top-full z-50 border-b border-white/60 bg-[#fffaf6] px-4 pb-6 pt-3 shadow-xl transition-all",
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
          )}
        >
          <ul className="grid gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-base font-semibold transition",
                    isActive(link.href) ? "bg-orange-100 text-orange-700" : "bg-white text-slate-700 hover:bg-orange-50",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            <li>
              <Link
                href="/new-lost"
                onClick={closeMenu}
                className="block rounded-xl bg-orange-500 px-4 py-3 text-base font-semibold text-white transition hover:bg-orange-600"
              >
                Post Item
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    href="/account"
                    onClick={closeMenu}
                    className="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    My Account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/api/auth/signout"
                    onClick={closeMenu}
                    className="block rounded-xl border border-orange-200 bg-white px-4 py-3 text-base font-semibold text-orange-700 transition hover:bg-orange-50"
                  >
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/api/auth/signin"
                  onClick={closeMenu}
                  className="block rounded-xl border border-orange-200 bg-white px-4 py-3 text-base font-semibold text-orange-700 transition hover:bg-orange-50"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
