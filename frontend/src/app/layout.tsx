import Providers from "@/providers/app-providers";
import "./globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className="h-screen bg-gradient-radial from-[#282828] via-[#1a1a1a] to-[#0a0a0a]">
            <Navbar/>
            <div className="px-16">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
