// File path: app/(auth-pages)/layout.tsx
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 flex flex-col gap-12 items-center">
      {children}
    </div>
  );
}
