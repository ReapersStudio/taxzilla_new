"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { mainNav, products, company, services } from "@/lib/site";
import { serviceIcons } from "@/lib/icons";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 w-full transition-all duration-500">
        <header
          className={cn(
            "w-full transition-all duration-500 border-b",
            scrolled 
              ? "bg-white/95 backdrop-blur-lg border-ink-200 shadow-sm py-3" 
              : "bg-white border-transparent py-5 shadow-sm",
          )}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
            <Link href="/" className="group flex items-center gap-2 focus-visible:outline-none">
              <Logo priority className="h-8 w-auto transition-transform duration-300 group-hover:scale-105" />
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {mainNav.map((item) => {
                if (item.label === "Our Services") {
                  return (
                    <div key="Our Services" className="group relative py-2">
                      <button
                        className={cn(
                          "relative text-sm font-bold transition-colors flex items-center gap-1.5",
                          pathname.startsWith("/services") ? "text-brand-600" : "text-ink-600 hover:text-brand-600"
                        )}
                      >
                        Our Services
                        <svg className="h-4 w-4 opacity-50 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                        {pathname.startsWith("/services") && (
                          <span className="absolute bottom-0 left-0 h-0.5 w-full bg-brand-600 rounded-full" />
                        )}
                      </button>

                      <div className="absolute left-1/2 top-full invisible w-200 -translate-x-1/2 pt-6 opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-50">
                        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-ink-100 grid grid-cols-[1.8fr_1fr]">
                          <div className="p-8 bg-white">
                            <div className="flex items-center justify-between mb-5">
                              <h3 className="text-xs font-bold uppercase tracking-widest text-ink-500">Taxzilla Services</h3>
                              <Link href="/services" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group/all">
                                View All <ArrowRight className="h-3 w-3 transition-transform group-hover/all:translate-x-1" />
                              </Link>
                            </div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                              {services.map((s) => {
                                const Icon = serviceIcons[s.icon] ?? serviceIcons.building;
                                return (
                                  <Link
                                    key={s.slug}
                                    href={`/services/${s.slug}`}
                                    className="group/item flex items-start gap-4 rounded-xl p-3 transition-all hover:bg-white hover:shadow-sm border border-transparent hover:border-ink-100"
                                  >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-700 transition-colors group-hover/item:bg-brand-50 group-hover/item:text-brand-600 border border-ink-100/50 group-hover/item:border-brand-100">
                                      <Icon className="h-6 w-6" strokeWidth={1.5} />
                                    </div>
                                    <div className="flex flex-col pt-0.5">
                                      <span className="font-bold text-ink-900 group-hover/item:text-brand-600 text-[15px]">
                                        {s.title}
                                      </span>
                                      <span className="text-xs text-ink-500 mt-1 leading-relaxed line-clamp-1">
                                        {s.short}
                                      </span>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                          <div className="p-8 bg-linear-to-br from-brand-600 to-brand-800 text-white flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-white opacity-5 blur-2xl" />
                            
                            <div className="relative z-10">
                              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm">
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                              <h4 className="text-xl font-display font-bold mb-3">Talk to an Expert</h4>
                              <p className="text-brand-50 text-sm mb-6 leading-relaxed font-medium">
                                Need help choosing the right service? Get a free consultation today.
                              </p>
                              <ButtonLink href="/contact" className="bg-white text-brand-800 hover:bg-brand-50 rounded-full font-bold px-6 py-2.5 shadow-lg shadow-black/10 self-start transition-transform hover:-translate-y-0.5">
                                Contact Us
                              </ButtonLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                if (item.label === "Our Products") {
                  return (
                    <div key="Our Products" className="group relative py-2">
                      <button
                        className={cn(
                          "relative text-sm font-bold transition-colors flex items-center gap-1.5",
                          pathname.startsWith("/products") ? "text-brand-600" : "text-ink-600 hover:text-brand-600"
                        )}
                      >
                        Our Products
                        <svg className="h-4 w-4 opacity-50 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                        {pathname.startsWith("/products") && (
                          <span className="absolute bottom-0 left-0 h-0.5 w-full bg-brand-600 rounded-full" />
                        )}
                      </button>

                      <div className="absolute left-1/2 top-full invisible w-[650px] -translate-x-1/2 pt-6 opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-50">
                        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-ink-100 grid grid-cols-[1.5fr_1fr]">
                          <div className="p-8 bg-ink-50/30">
                            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-ink-500">Taxzilla Products</h3>
                            <div className="flex flex-col gap-3">
                              {products.map((p) =>
                                p.href ? (
                                  <a
                                    key={p.label}
                                    href={p.href}
                                    target={p.external ? "_blank" : undefined}
                                    rel={p.external ? "noopener noreferrer" : undefined}
                                    className="group/item flex flex-col rounded-xl p-3 -mx-3 transition-all hover:bg-white hover:shadow-sm border border-transparent hover:border-ink-100"
                                  >
                                    <span className="font-bold text-ink-900 group-hover/item:text-brand-600 flex items-center gap-2">
                                      {p.label}
                                      <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-hover/item:opacity-100 group-hover/item:translate-x-0 text-brand-600" />
                                    </span>
                                    <span className="text-xs text-ink-500 mt-1 leading-relaxed">{p.description}</span>
                                  </a>
                                ) : (
                                  <div key={p.label} className="group/item relative flex flex-col rounded-xl p-3 -mx-3 border border-dashed border-ink-200 bg-ink-50/50 mt-1 transition-all duration-300 hover:bg-ink-100/50 hover:border-ink-300 hover:shadow-sm">
                                    <span className="font-bold text-ink-700 flex items-center gap-2">
                                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white shadow-sm border border-ink-100 transition-transform duration-300 group-hover/item:scale-110 group-hover/item:-rotate-3">
                                        <Sparkles className="h-3.5 w-3.5 text-brand-500 animate-pulse" />
                                      </div>
                                      {p.label}
                                      <span className="text-[9px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded-md border border-brand-100 ml-auto">
                                        Coming Soon
                                      </span>
                                    </span>
                                    <span className="text-xs text-ink-500 mt-1.5 leading-relaxed pl-8">{p.description}</span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                          <div className="p-8 bg-linear-to-br from-brand-600 to-brand-800 text-white flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-white opacity-5 blur-2xl" />
                            
                            <div className="relative z-10">
                              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                              <h4 className="text-2xl font-display font-bold mb-3">Automate Your Workflow</h4>
                              <p className="text-brand-100 text-sm mb-8 leading-relaxed font-medium">
                                Discover how our proprietary tools cut filing time in half and eliminate compliance errors.
                              </p>
                              <ButtonLink href="/contact" className="bg-white text-brand-800 hover:bg-brand-50 rounded-full font-bold px-6 py-2.5 shadow-lg shadow-black/10 self-start transition-transform hover:-translate-y-0.5">
                                Explore Solutions
                              </ButtonLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative text-sm font-bold transition-colors py-2",
                      active ? "text-brand-600" : "text-ink-600 hover:text-brand-600",
                    )}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute bottom-0 left-0 h-0.5 w-full bg-brand-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center gap-6 lg:flex">
              <a
                href={company.phoneHref}
                className="flex items-center gap-2.5 text-sm font-bold text-ink-700 hover:text-brand-600 transition-colors"
              >
                <div className="h-9 w-9 rounded-full bg-ink-100 flex items-center justify-center transition-colors hover:bg-brand-50">
                  <Phone className="h-4 w-4 text-brand-600" />
                </div>
                {company.phone}
              </a>
              <ButtonLink href="/contact" className="bg-accent-500 text-ink-950 hover:bg-accent-400 shadow-xl shadow-accent-500/20 rounded-full px-7 py-3 text-sm font-extrabold transition-all hover:-translate-y-0.5">
                Get Started
              </ButtonLink>
            </div>

            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-ink-600 hover:bg-ink-100 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </header>
      </div>

      {open && (
        <div className="fixed inset-x-4 top-24 z-40 rounded-3xl border border-ink-200 glass-panel lg:hidden animate-fade-up shadow-2xl">
          <div className="p-4">
            <nav className="flex flex-col gap-1">
              {mainNav
                .filter((item) => item.label !== "Our Products")
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-xl px-4 py-3 text-base font-semibold transition-colors",
                      isActive(item.href)
                        ? "bg-brand-50 text-brand-700"
                        : "text-ink-700 hover:bg-ink-50 hover:text-ink-900",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}

              <div className="my-2 border-t border-ink-100" />

              <div className="px-4 py-2">
                <span className="text-xs font-bold uppercase tracking-widest text-ink-500">Our Products</span>
                <div className="mt-2 flex flex-col gap-2">
                  {products.map((p) =>
                    p.href ? (
                      <a
                        key={p.label}
                        href={p.href}
                        target={p.external ? "_blank" : undefined}
                        rel={p.external ? "noopener noreferrer" : undefined}
                        className="text-sm font-semibold text-ink-700 hover:text-brand-600"
                      >
                        {p.label}
                      </a>
                    ) : (
                      <span key={p.label} className="text-sm font-semibold text-ink-400">
                        {p.label}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </nav>
            <div className="mt-6 flex flex-col gap-3 border-t border-ink-100 pt-6 p-4">
              <a
                href={company.phoneHref}
                className="flex items-center justify-center gap-2 rounded-xl bg-ink-50 px-4 py-3 text-sm font-semibold text-ink-900 transition hover:bg-ink-100"
              >
                <Phone className="h-4 w-4 text-brand-600" />
                Call {company.phone}
              </a>
              <ButtonLink href="/contact" className="w-full justify-center bg-accent-500 text-ink-950 rounded-xl py-3 shadow-md hover:bg-accent-400 font-extrabold">
                Get Started Free
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
