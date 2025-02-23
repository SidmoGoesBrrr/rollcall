// File path: app/(profiles)/layout.tsx
export default async function Layout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="flex flex-col gap-12 p-6">{children}</div>
    );
  }
  