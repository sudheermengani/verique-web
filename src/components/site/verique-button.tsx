import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const veriqueButtonVariants = cva(
  "inline-flex items-center gap-2 rounded-full font-bold transition-all duration-200 [&_.arrow]:transition-transform [&_.arrow]:duration-200 hover:[&_.arrow]:translate-x-[3px]",
  {
    variants: {
      variant: {
        grad: "bg-grad text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(37,99,235,0.45)]",
        primary:
          "bg-ink text-white shadow-[0_6px_18px_rgba(10,18,36,0.22)] hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(10,18,36,0.3)]",
        ghost:
          "bg-transparent text-ink shadow-[inset_0_0_0_1.5px_var(--color-line)] hover:shadow-[inset_0_0_0_1.5px_var(--color-ink)]",
        light:
          "bg-white text-ink hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(0,0,0,0.25)]",
      },
      size: {
        default: "px-7 py-3.5 text-[15.5px]",
        sm: "px-5.5 py-2.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "grad",
      size: "default",
    },
  }
);

type BaseProps = VariantProps<typeof veriqueButtonVariants> & {
  className?: string;
  children: React.ReactNode;
};

type LinkProps = BaseProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

type ButtonProps = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export function VeriqueButton({
  href,
  variant,
  size,
  className,
  children,
  ...props
}: LinkProps | ButtonProps) {
  const classes = cn(veriqueButtonVariants({ variant, size, className }));

  if (href) {
    return (
      <Link href={href} className={classes} {...(props as Omit<LinkProps, "href" | "variant" | "size" | "className" | "children">)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

export function Arrow() {
  return <span className="arrow">→</span>;
}
