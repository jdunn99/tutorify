export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto p-24 bg-white overflow-x-hidden sm:px-6 md:px-8 max-w-screen-lg">
      {children}
    </div>
  );
}
