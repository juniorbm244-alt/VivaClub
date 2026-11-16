import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VivaClub — Conecte. Participe. Conquiste.",
  description: "Uma comunidade de oportunidades, conteúdo e recompensas.",
  applicationName: "VivaClub",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b0c",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
