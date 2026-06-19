import { ArrowRight, CheckCircle2, ChevronRight, Phone, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { company, services } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";

const testimonials = [
  {
    quote: "Adherance to Government Compliances is a tough job for any business man... Taxzilla was able to work efficiently and effectively...",
    name: "Mr. Dhanush Mathan Kabilan",
    role: "CEO, Nutwin",
    image: "/old-site/assets-images-t1.jpg",
  },
  {
    quote: "I have been having few doubts regarding GST invoicing and filing. Taxzilla had good knowledge...",
    name: "Mr. Bala Murali",
    role: "CEO, Golden Battery Shop",
    image: "/old-site/assets-images-t2.jpg",
  },
  {
    quote: "Excellent! Taxzilla provides quality customer service. They have done their time...",
    name: "Ms. Jothi",
    role: "Proprietor, Master Choice",
    image: "/old-site/assets-images-t3.jpg",
  },
];

const faqs = [
  {
    q: "Which services does Taxzilla offer?",
    a: "GST and income tax filing, company and firm registrations, accounting and bookkeeping, business consulting, EXIM management, HR and payroll, FSSAI and trademarks — all under one roof.",
  },
  {
    q: "Do you work with businesses outside Tamil Nadu?",
    a: "Yes. While we're based in Tuticorin, we serve startups, MSMEs and individuals across India, entirely online.",
  },
  {
    q: "How does pricing work?",
    a: "After a free consultation we share a clear, fixed quote — usually within one business day. No hidden charges.",
  },
  {
    q: "How do I get started?",
    a: "Send us a message through the contact form or call us. We'll understand your need and map out the next steps.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ═══════ HERO — Cinematic Corporate Video Background ═══════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32 bg-[#0B1120]">

        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          {/* We use the poster image as a background if video isn't loaded or supported */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-video-poster.png')" }}
          />
          {/* 
            Placeholder video. In a real app, replace src with your actual CDN video URL.
            Using a generic URL for demonstration, but falling back to poster nicely. 
          */}
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/hero-video-poster.png"
            className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
          >
            <source src="https://cdn.coverr.co/videos/coverr-people-working-in-an-office-4202/1080p.mp4" type="video/mp4" />
          </video>

          {/* Deep Blue/Emerald Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-[#0B1120]/95 via-[#0f2027]/85 to-[#203a43]/70" />
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxwYXRoIGQ9Ik0gMjAgMCBMMCAwIDAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-70" />
        </div>
        <Container className="relative z-10 w-full">
          <div className="mx-auto max-w-4xl text-center flex flex-col items-center">

            {/* Logo */}
            <div
              className="bg-white/95 p-5 rounded-3xl backdrop-blur-md shadow-2xl mb-8"
              style={{ animation: "fade-up 0.8s 0.1s both" }}
            >
              <Image
                src="/logo.png"
                alt="Taxzilla"
                width={250}
                height={54}
                className="h-auto w-50 sm:w-60"
                style={{ height: "auto" }}
                priority
              />
            </div>

            {/* Headline */}
            <h1
              className="font-display text-[2.15rem] sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] sm:leading-tight"
              style={{ animation: "fade-up 0.8s 0.2s both" }}
            >
              Excellence in
              <span className="block text-brand-600">
                Corporate <br className="sm:hidden" />
                Compliance
              </span>
            </h1>

            {/* Sub-text */}
            <p
              className="mt-6 max-w-2xl text-base sm:text-xl leading-relaxed text-gray-300 font-medium"
              style={{ animation: "fade-up 0.8s 0.3s both" }}
            >
              Empowering 1,200+ businesses with precision GST, income tax, and registrations — driven by expert CAs and robust automation.
            </p>

            {/* CTAs */}
            <div
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              style={{ animation: "fade-up 0.8s 0.4s both" }}
            >
              <ButtonLink
                href="/contact"
                className="group flex items-center justify-center gap-2 rounded-lg bg-accent-500 hover:bg-accent-400 px-8 py-4 text-base font-extrabold text-ink-950 transition-all shadow-lg shadow-accent-500/30 w-full sm:w-auto relative overflow-hidden animate-shine"
              >
                Schedule Consultation
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </ButtonLink>
              <ButtonLink
                href="/services"
                variant="secondary"
                className="group flex items-center justify-center gap-2 rounded-lg border border-gray-400/30 hover:border-white bg-white/5 hover:bg-white/10 px-8 py-4 text-base font-bold text-white transition-all backdrop-blur-sm w-full sm:w-auto"
              >
                Explore Services
              </ButtonLink>
            </div>

            {/* Trust Indicators */}
            <div
              className="mt-14 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-7 w-full max-w-3xl sm:mt-16 sm:pt-8"
              style={{ animation: "fade-up 0.8s 0.5s both" }}
            >
              <div className="px-1 sm:px-6">
                <p className="font-display text-2xl sm:text-3xl font-bold text-white">
                  <Counter value="300+" />
                </p>
                <p className="mt-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider sm:tracking-widest text-accent-500">Happy Clients</p>
              </div>
              <div className="px-1 sm:px-6">
                <p className="font-display text-2xl sm:text-3xl font-bold text-white">
                  <Counter value="14+" />
                </p>
                <p className="mt-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider sm:tracking-widest text-accent-500">Professionals</p>
              </div>
              <div className="px-1 sm:px-6">
                <p className="font-display text-2xl sm:text-3xl font-bold text-white">
                  <Counter value="38+" />
                </p>
                <p className="mt-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider sm:tracking-widest text-accent-500">Cities Reached</p>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Marquee */}
      <section className="border-y border-ink-100 bg-white py-10 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-white to-transparent z-10" />
        <div className="flex w-max animate-marquee gap-8 px-4 hover:[animation-play-state:paused]">
          {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, i) => (
            <div key={i} className="glass-panel w-100 shrink-0 rounded-2xl p-6 transition-colors hover:bg-ink-50 border border-ink-100 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-[#f59e0b] text-[#f59e0b]" />
                ))}
              </div>
              <p className="italic text-ink-700 text-sm leading-relaxed">&quot;{t.quote}&quot;</p>
              <div className="mt-4 flex items-center gap-3 border-t border-ink-100 pt-4">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm"
                />
                <div>
                  <p className="font-bold text-ink-900 text-sm">{t.name}</p>
                  <p className="text-brand-600 text-xs font-semibold uppercase mt-1">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Taxzilla */}
      <Section className="bg-white py-24 border-b border-ink-100">
        <Reveal>
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-ink-50 rounded-[3rem] -z-10 rotate-3 transition-transform hover:rotate-6"></div>
              <Image src="/images/office_team.png" alt="Taxzilla Office Team" width={800} height={600} className="rounded-2xl shadow-xl object-cover h-125" />

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-ink-100 flex items-center gap-3 animate-float-slow">
                <div className="bg-accent-100 text-accent-700 p-2 rounded-xl">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="pr-2">
                  <p className="font-bold text-ink-900 leading-tight">10+ Years</p>
                  <p className="text-xs text-ink-500">Experience</p>
                </div>
              </div>
            </div>
            <div className="animate-in slide-in-from-right-12 duration-1000">
              <h2 className="font-display text-sm font-bold uppercase tracking-widest text-brand-600 mb-3">Why Taxzilla</h2>
              <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-ink-900 leading-tight mb-6">
                A to Z Business Solutions <br /> Under One Roof
              </h3>
              <p className="text-ink-600 text-lg leading-relaxed mb-8">
                Leave the hassles of company registrations, legal compliances and tax filing services to us, and focus your full attention towards growing your business. Our experienced team will guide you step by step, provide periodical job status updates and ensure that the work is complete on time, at an affordable price.
              </p>
              <div className="bg-ink-50 p-6 rounded-2xl border border-ink-100 flex items-start gap-4">
                <div className="bg-accent-100 text-accent-700 p-3 rounded-xl shrink-0">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-ink-900 text-lg">We Cater To</h4>
                  <p className="text-ink-500 mt-1">Startups, MSMEs and Individuals</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* Services Grid (Show only 3) */}
      <Section className="bg-ink-50 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">Compliance solved. <br /> Growth unlocked.</h2>
            <p className="mt-4 text-ink-500 text-lg">We handle the paperwork so you can focus on your business.</p>
          </Reveal>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {services.slice(0, 3).map((service, index) => (
            <Reveal key={service.slug} delay={index * 150}>
              <div className="group relative overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 border border-ink-100 hover:border-brand-200 p-0 sm:p-8">
                <div className="relative h-44 overflow-hidden sm:hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="92vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-ink-950/55 via-ink-950/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-lg">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                </div>
                <div className="absolute inset-0 z-0 hidden opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 sm:block">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-white via-white/60 to-transparent"></div>
                </div>
                <div className="relative z-10 p-6 sm:p-0">
                  <div className="mb-6 hidden h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 transition-transform group-hover:scale-110 group-hover:bg-brand-100 sm:flex">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-bold text-ink-900 mb-3 sm:text-xl">{service.title}</h3>
                  <p className="text-ink-500 text-sm leading-relaxed mb-5 sm:mb-6">{service.short}</p>
                  <div className="flex items-center text-brand-600 font-bold text-sm group-hover:text-brand-700">
                    Read more <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
                <Link href={`/services/${service.slug}`} className="absolute inset-0 z-20"><span className="sr-only">View {service.title}</span></Link>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Reveal delay={450}>
            <ButtonLink href="/services" variant="secondary" className="bg-white border border-ink-200 shadow-sm hover:shadow-md hover:border-ink-300 text-ink-900 font-bold rounded-full px-8 py-4">
              View all services
            </ButtonLink>
          </Reveal>
        </div>
      </Section>

      {/* Distinguished Features */}
      <Section className="bg-white py-24 border-t border-ink-100">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink-900 leading-tight">Our Distinguished Features</h2>
            <div className="h-1.5 w-24 bg-brand-500 rounded-full mx-auto mt-6"></div>
          </Reveal>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Reveal delay={0}>
            <div className="group relative overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm transition-colors hover:border-brand-200 md:bg-ink-50 md:p-8">
              <div className="relative h-44 overflow-hidden md:hidden">
                <Image
                  src="/images/4.png"
                  alt="Tax solution support"
                  fill
                  sizes="92vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink-950/55 via-ink-950/10 to-transparent" />
                <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-lg">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 z-0 hidden opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 md:block">
                <Image
                  src="/images/4.png"
                  alt="Tax solution support"
                  fill
                  sizes="(min-width: 768px) 30vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink-50 via-ink-50/55 to-transparent"></div>
              </div>
              <div className="relative z-10 p-6 md:p-0">
                <div className="mb-6 hidden h-14 w-14 items-center justify-center rounded-2xl border border-ink-100 bg-white text-brand-600 shadow-sm animate-float md:flex">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-ink-900 mb-3 md:text-xl">Quick Response</h3>
                <p className="text-sm leading-relaxed text-ink-500 md:text-base">We understand that time is precious and crucial. We respond to all your queries quickly.</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="group relative overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm transition-colors hover:border-brand-200 md:bg-ink-50 md:p-8">
              <div className="relative h-44 overflow-hidden md:hidden">
                <Image
                  src="/images/5.png"
                  alt="Compliance reminders"
                  fill
                  sizes="92vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink-950/55 via-ink-950/10 to-transparent" />
                <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-lg">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 z-0 hidden opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 md:block">
                <Image
                  src="/images/5.png"
                  alt="Compliance reminders"
                  fill
                  sizes="(min-width: 768px) 30vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink-50 via-ink-50/55 to-transparent"></div>
              </div>
              <div className="relative z-10 p-6 md:p-0">
                <div className="mb-6 hidden h-14 w-14 items-center justify-center rounded-2xl border border-ink-100 bg-white text-brand-600 shadow-sm animate-float md:flex">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-ink-900 mb-3 md:text-xl">Timely Reminders</h3>
                <p className="text-sm leading-relaxed text-ink-500 md:text-base">We take care of renewal date reminders for licenses and due date reminders for monthly, quarterly and yearly filing works.</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="group relative overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-sm transition-colors hover:border-brand-200 md:bg-ink-50 md:p-8">
              <div className="relative h-44 overflow-hidden md:hidden">
                <Image
                  src="/images/6.png"
                  alt="Organised business setup"
                  fill
                  sizes="92vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink-950/55 via-ink-950/10 to-transparent" />
                <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-lg">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="absolute inset-0 z-0 hidden opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 md:block">
                <Image
                  src="/images/6.png"
                  alt="Organised business setup"
                  fill
                  sizes="(min-width: 768px) 30vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink-50 via-ink-50/55 to-transparent"></div>
              </div>
              <div className="relative z-10 p-6 md:p-0">
                <div className="mb-6 hidden h-14 w-14 items-center justify-center rounded-2xl border border-ink-100 bg-white text-brand-600 shadow-sm animate-float md:flex">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-ink-900 mb-3 md:text-xl">Organised Work Structure</h3>
                <p className="text-sm leading-relaxed text-ink-500 md:text-base">We follow work processes and process controls, to provide a seamless customer experience.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-white py-24 border-t border-ink-100">
        <Reveal>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-display text-4xl font-extrabold text-ink-900 leading-tight">Got questions? We&apos;ve got answers.</h2>
            <p className="mt-4 text-ink-500 text-lg leading-relaxed max-w-2xl mx-auto">Can&apos;t find what you&apos;re looking for? Our friendly team is always here to help you understand your compliance needs.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-ink-50 rounded-2xl p-6 border border-ink-100 flex flex-col">
                <h3 className="text-lg font-bold text-ink-900 mb-3 flex items-start gap-3">
                  <span className="text-accent-500 mt-1 shrink-0"><CheckCircle2 className="h-5 w-5" /></span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-ink-600 leading-relaxed ml-8">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <ButtonLink href="/contact?topic=Others" variant="secondary" className="bg-ink-50 hover:bg-ink-100 text-ink-900 font-bold px-8 py-4 rounded-full inline-flex">
              Ask a question
            </ButtonLink>
          </div>
        </Reveal>
      </Section>

      {/* CTA */}
      <Section
        className="py-32 relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/cta_bg.png')" }}
      >
        <div className="absolute inset-0 bg-brand-900/85 mix-blend-multiply"></div>
        <Reveal>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">Consult Anywhere Anytime</h2>
            <p className="mt-6 text-xl text-brand-100 max-w-2xl mx-auto leading-relaxed">Our support team can meet you at your door step, at your convenient time and carry forward with any of our services.</p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              <ButtonLink href="/contact" variant="secondary" size="lg" className="bg-accent-500 text-ink-950 border-transparent hover:bg-accent-400 shadow-xl px-10 py-5 rounded-full text-lg w-full sm:w-auto font-extrabold relative overflow-hidden animate-shine">
                Get started now <ArrowRight className="h-5 w-5 ml-2" />
              </ButtonLink>
              <a href={company.phoneHref} className="text-white hover:text-brand-200 font-bold text-lg flex items-center gap-2 transition-colors">
                <Phone className="h-5 w-5" /> {company.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
