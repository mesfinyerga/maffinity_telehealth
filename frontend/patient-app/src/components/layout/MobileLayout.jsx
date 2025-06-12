export default function MobileLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>
    </div>
  );
}

