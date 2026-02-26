import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/client-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://astriviaai.tech"),
  title: {
    default: "Astrivia AI | Sistema Operacional de Agentes para Life Sciences",
    template: "%s | Astrivia AI",
  },
  description:
    "O primeiro sistema operacional de agentes autônomos para Life Sciences. Transformamos atrito regulatório em autonomia inteligente com IA agêntica.",
  keywords: [
    "IA pharma",
    "agentes autônomos",
    "life sciences",
    "RDC 96",
    "farmacovigilância",
    "Vertex AI",
  ],
  authors: [{ name: "Astrivia AI" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://astriviaai.tech",
    siteName: "Astrivia AI",
    title: "Astrivia AI | Sistema Operacional de Agentes para Life Sciences",
    description:
      "O primeiro sistema operacional de agentes autônomos para Life Sciences.",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@astriviaai",
    creator: "@astriviaai",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
