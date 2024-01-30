"use client";

import { cn } from "@/lib/utils";


interface HeadingProps {
  title: string;
  description: string;
  className?: string
};


const Heading: React.FC<HeadingProps> = ({
  className,
  title,
  description
}) => {
  return (
    <div>
      <h2 className={cn("text-3xl font-bold tracking-tight", className)}>{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export default Heading
