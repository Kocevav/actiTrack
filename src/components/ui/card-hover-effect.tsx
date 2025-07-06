import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

// Status mapping function for badge label and color
function getStatusProps(status: string) {
  switch (status) {
    case "CREATED":
      return { label: "Active", color: "bg-green-600/80 text-white" };
    case "FINISHED":
      return { label: "Finished", color: "bg-gray-600/80 text-gray-200" };
    case "ARCHIVED":
      return { label: "Archived", color: "bg-yellow-800/80 text-yellow-200" };
    default:
      return { label: status, color: "bg-gray-600/80 text-gray-200" };
  }
}

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    owner: string;
    time: string;
    place: string;
    participants: number;
    status: string;
    comments: string[];
    link: string;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-8 py-10",
        "md:grid-cols-2",
        className
      )}
    >
      {items
        .filter((item) => !!item.link)
        .map((item, idx) => {
          const { label, color } = getStatusProps(item.status);

          return (
            <Link
              href={item.link}
              key={item.link}
              className="relative group block h-full w-full"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <AnimatePresence>
                {hoveredIndex === idx && (
                  <motion.span
                    className="absolute inset-0 h-full w-full bg-gradient-to-br from-orange-500/30 via-orange-700/20 to-transparent rounded-3xl opacity-80 blur-md pointer-events-none transition duration-200"
                    layoutId="hoverBackground"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { duration: 0.4 },
                    }}
                    exit={{
                      opacity: 0,
                      transition: { duration: 0.4, delay: 0.1 },
                    }}
                  />
                )}
              </AnimatePresence>
              <Card>
                <div className="flex flex-col md:flex-row items-start gap-6">
                  {/* Icon or status badge */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center min-w-[64px]">
                    <div
                      className={cn(
                        "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider",
                        color
                      )}
                    >
                      {label}
                    </div>
                    <div className="mt-4 text-4xl">🎉</div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                    <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-orange-100/90">
                      <InfoItem icon="👤" label="Owner" value={item.owner} />
                      <InfoItem icon="⏰" label="Time" value={item.time} />
                      <InfoItem icon="📍" label="Place" value={item.place} />
                      <InfoItem
                        icon="👥"
                        label="Participants"
                        value={item.participants}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) => (
  <span className="flex items-center gap-1">
    <span>{icon}</span>
    <span className="font-semibold">{label}:</span>
    <span className="ml-1">{value}</span>
  </span>
);

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-3xl h-full w-full overflow-hidden",
        "bg-neutral-900/80 backdrop-blur-md shadow-xl border border-orange-400/10 group-hover:border-orange-500/30 transition-all duration-300",
        className
      )}
    >
      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "text-2xl font-extrabold text-orange-200 tracking-wide mb-2",
        className
      )}
    >
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mb-2 text-zinc-300 tracking-wide leading-relaxed text-base",
        className
      )}
    >
      {children}
    </p>
  );
};
