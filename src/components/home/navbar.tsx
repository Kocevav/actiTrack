"use client";
import React from "react";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
import { FloatingNav } from "../ui/floating-navbar";
export function FloatingNavBar({
  setShowForm,
  whichForm,
}: {
  setShowForm: (show: boolean) => void;
  whichForm: boolean;
}) {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-5 w-5" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconUser className="h-5 w-5" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: <IconMessage className="h-5 w-5" />,
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
