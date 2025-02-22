"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { IconBox, IconSettings, IconUserBolt } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Navbar from "@/components/component/Navbar";
import { usePackages } from "@/context/PackageContext";
import Image from "next/image";
import { PackageDetailModal } from "@/components/ui/package-detail_modal";

export function SidebarDemo() {
  const links = [
    {
      label: "All Packages",
      href: "/agencies",
      icon: <IconBox className="text-zinc-300 dark:text-zinc-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Create a Package",
      href: "/list-package",
      icon: <IconUserBolt className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <IconSettings className="text-zinc-300 dark:text-zinc-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen">
      <Navbar />
      <div className={cn("flex flex-col md:flex-row bg-zinc-900 text-zinc-200 flex-1 border border-zinc-800 overflow-hidden pt-16", "h-screen w-screen")}>
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} className="text-zinc-200" />
                ))}
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
        <MainContent />
      </div>
    </div>
  );
}

export const Logo = () => (
  <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-zinc-200 py-1 relative z-20">
    <div className="h-5 w-6 bg-zinc-900 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium text-zinc-200 whitespace-pre">
      Agency Dashboard
    </motion.span>
  </Link>
);

export const LogoIcon = () => (
  <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-zinc-200 py-1 relative z-20">
    <div className="h-5 w-6 bg-zinc-200 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
  </Link>
);

const MainContent = () => {
  const { packages } = usePackages();
  const [localPackages, setLocalPackages] = useState(packages);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (packages.length === 0) {
      const savedPackages = JSON.parse(localStorage.getItem("travelPackages") || "[]");
      setLocalPackages(savedPackages);
    }
  }, [packages]);

  const displayPackages = packages.length > 0 ? packages : localPackages;

  interface Package {
    images?: string[];
    packageTitle: string;
    destination: string;
    duration: string;
    basePrice: number;
  }

  const handlePackageClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-1 p-6">
      <div className="w-full h-full bg-zinc-900 text-zinc-200 p-2 rounded-lg border border-zinc-800 flex flex-col relative">
        {/* Fixed Title */}
        <div className="sticky bg-zinc-900 z-10 p-2 border-b border-zinc-700">
          <h1 className="text-2xl font-semibold text-zinc-100">Travel Packages</h1>
        </div>

        {/* Card Scrollable Section */}
        <div className="flex-1 overflow-y-auto p-4">
          {displayPackages.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">No packages listed yet</h2>
              <p className="mb-6">Start by creating your first travel package.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayPackages.map((pkg, index) => (
                <div 
                  key={index} 
                  className="bg-zinc-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                  onClick={() => handlePackageClick(pkg)}
                >
                  <div className="relative w-full h-40">
                    {pkg.images?.[0] ? (
                      <Image
                        src={pkg.images[0]}
                        alt={pkg.packageTitle}
                        width={256}
                        height={160}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="bg-gray-200 flex items-center justify-center h-full">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{pkg.packageTitle}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {pkg.destination} | {pkg.duration} | ${pkg.basePrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Package Detail Modal */}
      <PackageDetailModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        packageData={selectedPackage}
      />
    </div>
  );
};

export default SidebarDemo;
