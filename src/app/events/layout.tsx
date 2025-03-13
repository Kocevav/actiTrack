// "use client";
// import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
// import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from "@tabler/icons-react";
// import Image from "next/image";
// import { useState } from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";

// const links = [
//   { label: "Dashboard", href: "/", icon: <IconBrandTabler className="h-5 w-5" /> },
//   { label: "Profile", href: "/profile", icon: <IconUserBolt className="h-5 w-5" /> },
//   { label: "Settings", href: "/settings", icon: <IconSettings className="h-5 w-5" /> },
//   { label: "Logout", href: "/logout", icon: <IconArrowLeft className="h-5 w-5" /> },
// ];

// export default function Layout({ children }: { children: React.ReactNode }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="relative w-full min-h-screen flex bg-gray-100 dark:bg-neutral-800">
//       {/* Sidebar */}
//       <Sidebar open={open} setOpen={setOpen}>
//         <SidebarBody>
//           <Link
//             href="#"
//             className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
//           >
//             <div className="h-6 w-6 bg-black dark:bg-white rounded-lg shrink-0 transition-all duration-300" />
//             {open && (
//               <motion.span
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -10 }}
//                 className="font-medium whitespace-pre"
//               >
//                 Acet Labs
//               </motion.span>
//             )}
//           </Link>

//           {/* Sidebar Links */}
//           <div className="flex flex-col flex-1 overflow-y-auto">
//             <div className="mt-8 flex flex-col gap-2">
//               {links.map((link, idx) => (
//                 <SidebarLink key={idx} link={link} />
//               ))}
//             </div>
//           </div>

//           {/* User Profile */}
//           <SidebarLink
//             link={{
//               label: "Manu Arora",
//               href: "#",
//               icon: (
//                 <Image
//                   src="https://assets.aceternity.com/manu.png"
//                   width={30}
//                   height={30}
//                   alt="Avatar"
//                   className="h-7 w-7 rounded-full"
//                 />
//               ),
//             }}
//           />
//         </SidebarBody>
//       </Sidebar>

//       {/* Main Content */}
//       <main className="flex-1 flex flex-col min-h-screen  overflow-y-auto">
//         {children}
//       </main>
//     </div>
//   );
// }



"use client";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { 
  IconArrowLeft, 
  IconBrandTabler, 
  IconSettings, 
  IconUserBolt,
  IconMenu2,
  IconX
} from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const links = [
  { label: "Dashboard", href: "/", icon: <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" /> },
  { label: "Profile", href: "/profile", icon: <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" /> },
  { label: "Settings", href: "/settings", icon: <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" /> },
  { label: "Logout", href: "/logout", icon: <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" /> },
];

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm shrink-0" />
    </Link>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="relative w-full min-h-screen flex bg-gray-100 dark:bg-neutral-800">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div>
              <SidebarLink
                link={{
                  label: "Manu Arora",
                  href: "#",
                  icon: (
                    <Image
                      src="https://assets.aceternity.com/manu.png"
                      className="h-7 w-7 shrink-0 rounded-full"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
      </div>

      {/* Mobile Header with Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-neutral-100 dark:bg-neutral-800 z-50 flex items-center px-4">
        <IconMenu2
          className="text-neutral-800 dark:text-neutral-200 h-6 w-6"
          onClick={() => setOpen(!open)}
        />
        <div className="ml-4">
          <Logo />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed inset-0 bg-white dark:bg-neutral-900 p-6 z-[100] flex flex-col md:hidden"
            )}
          >
            <div className="flex justify-between items-center mb-8">
              <Logo />
              <IconX
                className="text-neutral-800 dark:text-neutral-200 h-6 w-6"
                onClick={() => setOpen(false)}
              />
            </div>
            
            <div className="flex flex-col gap-4 flex-1">
              {links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="flex items-center gap-3 py-2 text-neutral-700 dark:text-neutral-200"
                  onClick={() => setOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
            
            <div className="mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <Link
                href="#"
                className="flex items-center gap-3 py-2 text-neutral-700 dark:text-neutral-200"
              >
                <Image
                  src="https://assets.aceternity.com/manu.png"
                  className="h-7 w-7 rounded-full"
                  width={30}
                  height={30}
                  alt="Avatar"
                />
                <span>Manu Arora</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto md:ml-0 pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}