import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  center,
  className,
}: {
  children: React.ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <p className={cn("eyebrow", center && "center", className)}>{children}</p>
  );
}
