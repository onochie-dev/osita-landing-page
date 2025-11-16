import Link from "next/link";

const footerLinks = [
  { href: "#privacy", label: "Privacy" },
  { href: "#security", label: "Security" },
  { href: "#imprint", label: "Imprint" },
];

/**
 * Footer consolidates contact info and compliance links with an EU-inspired star motif.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-neutral-200/80 bg-white/95 py-12 dark:border-white/10 dark:bg-night/95">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -left-20 top-1/3 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 md:flex-row md:items-center md:justify-between md:px-10 lg:px-12">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-neutral-600 dark:text-neutral-300">
            Osita
          </p>
          <p className="max-w-md text-sm text-neutral-600 dark:text-neutral-300">
            Carbon compliance intelligence for CBAM and EU ETS teams across Europe.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300 md:flex-row md:items-center md:gap-6">
          <Link
            href="mailto:hello@osita.eu"
            className="font-semibold text-primary transition hover:text-primary-dark dark:text-white dark:hover:text-primary-light"
          >
            hello@osita.eu
          </Link>
          <div className="flex gap-4">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition hover:text-primary dark:hover:text-primary-light"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-neutral-200/70 dark:border-white/5">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-6 py-6 text-xs text-neutral-500 dark:text-neutral-400 md:flex-row md:items-center md:justify-between md:px-10 lg:px-12">
          <p>© {new Date().getFullYear()} Osita. All rights reserved.</p>
          <p>EU-based. GDPR compliant. ISO 27001 roadmap underway.</p>
        </div>
      </div>
    </footer>
  );
}

