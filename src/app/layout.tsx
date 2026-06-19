import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { company } from "@/lib/site";
import { publicEnv } from "@/lib/env";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.siteUrl),
  title: {
    default: `${company.name} — Accounts, Registrations & Tax Filing`,
    template: `%s · ${company.name}`,
  },
  description: company.description,
  openGraph: {
    title: `${company.name} — Accounts, Registrations & Tax Filing`,
    description: company.description,
    type: "website",
    locale: "en_IN",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`no-js ${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        {/* Flip no-js → js before paint, so scroll-reveal content is only
            hidden when JavaScript is actually running. Prevents a blank page
            if scripts are blocked/disabled. Static, developer-controlled. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');",
          }}
        />
        {children}
      </body>
    </html>
  );
}
