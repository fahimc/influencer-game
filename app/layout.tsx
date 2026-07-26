import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "StarSpark Live",
    template: "%s · StarSpark Live",
  },
  description:
    "A kid-safe rhythm and creator simulation game for web and Android.",
  applicationName: "StarSpark Live",
  icons: {
    icon: "/og.png",
    shortcut: "/og.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#14082f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
