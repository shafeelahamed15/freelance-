import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ClientHandle - Professional Client Management",
  description: "Streamline your client relationships with powerful onboarding, invoicing, and project management tools designed for modern freelancers and agencies.",
  keywords: "client management, invoicing, freelancer tools, project management, onboarding",
  authors: [{ name: "ClientHandle Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedTheme = localStorage.getItem('theme');
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const shouldUseDark = savedTheme === 'dark' || (savedTheme === null && systemPrefersDark);
                
                if (shouldUseDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased transition-colors duration-300`}
        style={{
          backgroundColor: 'oklch(var(--background))',
          color: 'oklch(var(--foreground))'
        }}
      >
        {children}
      </body>
    </html>
  );
}
