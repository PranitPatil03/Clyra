"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ComponentPropsWithoutRef, ReactNode } from "react";

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  className: string;
  background: ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  cta: string;
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[24rem] grid-cols-1 md:grid-cols-3 gap-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  ...props
}: BentoCardProps) => {
  return (
    <motion.div
      key={name}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden border border-gray-950/[.05] bg-white shadow-sm dark:border-gray-50/[.05] dark:bg-gray-950 cursor-pointer rounded-xl",
        className
      )}
      {...(props as any)}
    >
      <div className="absolute inset-0 size-full">
        {background}
      </div>
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 mt-auto">
        <Icon className="h-10 w-10 origin-left transform-gpu text-neutral-700 dark:text-neutral-300" />
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mt-2">
          {name}
        </h3>
        <p className="max-w-lg text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      </div>

      {/* Bright glowing shine effect on hover */}
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-500 opacity-0 group-hover:opacity-100 z-10">
        {/* Soft colored glow from top */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(129,140,248,0.15),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_-20%,rgba(129,140,248,0.25),transparent_70%)]" />
        {/* Shiny border top highlight */}
        <div className="absolute inset-0 shadow-[inset_0_2px_20px_rgba(255,255,255,0.6)] dark:shadow-[inset_0_2px_20px_rgba(255,255,255,0.1)] rounded-3xl" />
        {/* Sheen gradient across the card */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent dark:via-white/10 mix-blend-overlay" />
      </div>
    </motion.div>
  );
};

export { BentoCard, BentoGrid };
