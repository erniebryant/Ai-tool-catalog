import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-6xl gap-4 p-4 text-sm">
            <Link href="/">Dashboard</Link>
            <Link href="/tools">Tool Directory</Link>
            <Link href="/sources">Sources</Link>
            <Link href="/admin/review">Admin Review</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </body>
    </html>
  );
}
