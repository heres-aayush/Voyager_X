"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [pathname, setPathname] = useState<string | null>(null);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  useEffect(() => {
    setPathname(window.location.pathname);
    setActiveLink(window.location.hash || pathname); // Set hash or pathname as active
  }, [pathname]);

  const isActive = (path: string) => activeLink === path;

  const handleLinkClick = (path: string) => {
    setActiveLink(path);
  };

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
                <NavLink
                  href="/how-it-works"
                  isActive={isActive("/how-it-works")}
                  onClick={() => handleLinkClick("/how-it-works")}
                >
                  How It Works
                </NavLink>
                <NavLink
                  href="/#features"
                  isActive={isActive("/#features")}
                  onClick={() => handleLinkClick("/#features")}
                >
                  Features
                </NavLink>
                <NavLink
                  href="/agencies"
                  isActive={isActive("/agencies")}
                  onClick={() => handleLinkClick("/agencies")}
                >
                  Agencies
                </NavLink>
                <NavLink
                  href="/locker"
                  isActive={isActive("/locker")}
                  onClick={() => handleLinkClick("/locker")}
                >
                  Locker
                </NavLink>
                <NavLink
                  href="/review"
                  isActive={isActive("/reviews")}
                  onClick={() => handleLinkClick("/reviews")}
                >
                  Reviews
                </NavLink>
              </div>
            </div>
          </div>

          {/* Connect Button */}
          <div>
            <ConnectButton />
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
  onClick: () => void;
}

function NavLink({ href, isActive, children, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm font-medium ${
        isActive ? "text-rose-400" : "text-white hover:text-rose-400"
      }`}
    >
      {children}
    </Link>
  );
}
