export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line py-4 px-4 text-center text-[0.75rem] text-muted">
        All game content and financial advice is for educational purposes only
        and does not constitute professional financial advice.
      </footer>
    </div>
  );
}
