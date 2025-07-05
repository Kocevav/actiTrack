"use client";
import React, { Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const FloatingNav = ({
  setShowForm,
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
  setShowForm: Dispatch<SetStateAction<boolean>>;
  whichForm: boolean;
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3, type: "spring" }}
        className={cn(
          "flex max-w-fit fixed top-7 inset-x-0 mx-auto z-[5000] items-center justify-center px-4 py-2 space-x-2",
          "rounded-full shadow-2xl border border-orange-500/30",
          "bg-gradient-to-br from-neutral-900/80 via-neutral-950/80 to-black/80 backdrop-blur-md",
          "ring-1 ring-orange-500/10",
          className
        )}
        aria-label="Main Navigation"
      >
        {navItems.map((navItem) => (
          <Link
            key={navItem.link}
            href={navItem.link}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200",
              "text-white hover:text-orange-400 focus:text-orange-400",
              "hover:bg-orange-500/10 focus:bg-orange-500/10 outline-none",
              "focus-visible:ring-2 focus-visible:ring-orange-400"
            )}
          >
            <span>{navItem.icon}</span>
            <span className="text-base">{navItem.name}</span>
          </Link>
        ))}

        <button
          className="ml-2 flex items-center gap-2 px-5 py-2 rounded-full font-semibold bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          onClick={() => setShowForm(true)}
        >
          <span>Login</span>
        </button>
      </motion.nav>
    </AnimatePresence>
  );
};
