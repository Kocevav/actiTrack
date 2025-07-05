"use client";
import Link from "next/link";
import Image from "next/image";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Spinner from "@/components/ui/spiner";

const links = [
  {
    label: "Dashboard",
    href: "/",
    icon: <IconBrandTabler className="h-5 w-5 text-orange-400" />,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: <IconUserBolt className="h-5 w-5 text-orange-400" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <IconSettings className="h-5 w-5 text-orange-400" />,
  },
  {
    label: "Logout",
    href: "/logout",
    icon: <IconArrowLeft className="h-5 w-5 text-orange-400" />,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const name = session.data?.user?.name;
  const image = session.data?.user?.image;
  const id = session.data?.userId;
  const [loggingOut, setLoggingOut] = useState(false);

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-neutral-900 via-neutral-950 to-black">
      {/* Spinner Overlay */}
      {loggingOut && <Spinner text="Logging out…" />}
      {/* Sidebar */}
      <aside className="w-[260px] h-screen flex flex-col justify-between py-6 px-4 bg-neutral-900/90 border-r border-orange-400/10 shadow-2xl rounded-tr-3xl rounded-br-3xl">
        <Link href="/" className="flex items-center gap-3 mb-8">
          <span className="font-extrabold text-xl text-orange-200 tracking-wide drop-shadow">
            ActiTrack
          </span>
        </Link>
        <nav className="flex flex-col gap-2">
          {links.map((link, idx) => (
            <Link
              onClick={async (e) => {
                if (link.href === "/logout") {
                  e.preventDefault();
                  setLoggingOut(true);
                  await signOut({ callbackUrl: "/" });
                  // No need to setLoggingOut(false) because redirect will happen
                }
              }}
              key={idx}
              href={link.href === "/profile" ? link.href + `/${id}` : link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-xl font-semibold text-orange-200 hover:bg-orange-500/10 transition"
              )}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-orange-400/20">
          <Link
            href="/"
            className="flex items-center gap-3 py-2 text-orange-200"
          >
            {image && (
              <Image
                src={image}
                className="h-7 w-7 rounded-full"
                width={30}
                height={30}
                alt="Avatar"
              />
            )}

            <span className="font-bold">{name}</span>
          </Link>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center min-h-screen">
        {children}
      </main>
    </div>
  );
}
