export default function Loading() {
  return (
    <div className="animate-pulse px-5 py-8 md:px-10">
      <div className="mb-6 h-7 w-48 rounded bg-black/5" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] w-full rounded bg-black/5" />
            <div className="mt-2 h-3 w-3/4 rounded bg-black/5" />
            <div className="mt-1.5 h-3 w-1/2 rounded bg-black/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
