"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export default function Navbar() {
  const [pathname, setPathname] = useState<string | null>(null);

  // Ensure pathname is only set on the client-side
  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-10 backdrop-blur-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
              Voyager
              <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-transparent bg-clip-text">
                X
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink href="/how-it-works" isActive={isActive("/how-it-works")}>
                  How It Works
                </NavLink>
                <NavLink href="/features" isActive={isActive("/features")}>
                  Features
                </NavLink>
                <NavLink href="/agencies" isActive={isActive("/agencies")}>
                  Agencies
                </NavLink>
                <NavLink href="/locker" isActive={isActive("/locker")}>
                  Locker
                </NavLink>
                <NavLink href="/reviews" isActive={isActive("/reviews")}>
                  Reviews
                </NavLink>
              </div>
            </div>
          </div>

          {/* Connect Button */}
          <div>
            <Button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                Connect Wallet
              </span>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

// Navigation Link Component
interface NavLinkProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}

function NavLink({ href, isActive, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        isActive ? "text-rose-400" : "text-white hover:text-rose-400"
      }`}
    >
      {children}
    </Link>
  );
}