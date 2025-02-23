// File path: app/(profiles)/layout.tsx
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-col gap-6 px-4 py-6 sm:px-6 md:px-8">
      {children}
    </div>
  );
}
