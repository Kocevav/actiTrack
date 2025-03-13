/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { Dispatch, JSX, SetStateAction } from "react";
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
    icon?: JSX.Element;
  }[];
  className?: string;
  setShowForm: Dispatch<SetStateAction<boolean>>;
  whichForm: boolean;
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-7 inset-x-0 mx-auto border border-orange-100 dark:border-white/[20] rounded-full dark:bg-black  shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "relative dark:text-neutral-50 items-center flex space-x-1 text-white dark:hover:text-neutral-300 hover:text-orange-500 font-bold"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block text-sm">{navItem.name}</span>
          </Link>
        ))}
        <span className="absolute inset-x-0 mx-auto -bottom-px bg-gradient-to-r from-transparent via-orange-500 to-transparent h-px w-full" />

        <button
          className="border text-sm relative border-neutral-200 dark:border-white/[0.2] text-white dark:text-white px-4 py-2 rounded-full hover:text-orange-500 font-bold"
          onClick={() => sayHello(setShowForm)}
        >
          <span>Login</span>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

function sayHello(setShowForm: Dispatch<SetStateAction<boolean>>) {
  setShowForm(true);
}
