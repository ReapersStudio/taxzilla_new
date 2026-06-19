import Image from "next/image";
import { cn } from "@/lib/cn";

export function Logo({
  className,
  invert = false,
  priority = false,
}: {
  className?: string;
  invert?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt="Taxzilla Logo"
      width={250}
      height={54}
      priority={priority}
      style={{ width: "auto" }}
      className={cn(
        "h-10 w-auto object-contain",
        invert && "brightness-0 invert",
        className
      )}
    />
  );
}
