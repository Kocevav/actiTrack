"use client";
import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FloatingNavBar({
  setShowForm,
  whichForm,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setShowForm: any;
  whichForm: boolean;
}) {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: (
        <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];
  return (
    <div className="relative w-full">
      <FloatingNav
        navItems={navItems}
        setShowForm={setShowForm}
        whichForm={whichForm}
      />
    </div>
  );
}
