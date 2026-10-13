import type { ReactNode } from "react";

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto grid min-h-dvh w-full max-w-5xl content-start gap-8 px-4 py-8 sm:px-6 md:py-14">
      {children}
    </main>
  );
}