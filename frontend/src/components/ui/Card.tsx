import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export default function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <section
      className={[
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </section>
  );
}

type CardHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function CardHeader({
  children,
  className = "",
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={["border-b border-slate-100 px-5 py-4", className].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

type CardBodyProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function CardBody({
  children,
  className = "",
  ...props
}: CardBodyProps) {
  return (
    <div className={["p-5", className].join(" ")} {...props}>
      {children}
    </div>
  );
}

type CardFooterProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function CardFooter({
  children,
  className = "",
  ...props
}: CardFooterProps) {
  return (
    <div
      className={["border-t border-slate-100 px-5 py-4", className].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
