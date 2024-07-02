import Navbar from "@components/Navbar";
// Layout with Navbar

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <main>
            <Navbar />
            {children}
        </main>
  );
}
