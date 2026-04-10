import Link from "next/link";

export const dynamic = "force-dynamic";

async function FoundItemView({ params }: { params: Promise<{ foundId: string }> }) {
  const { foundId } = await params;

  const result = await fetch(process.env.BACKEND + "/api/found/" + foundId, { cache: "no-store" });
  const json = await result.json();
  const images = Array.isArray(json.images) ? json.images.filter(Boolean) : [];

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6 space-y-6">
      <Link href={"/found"} className="text-blue-500">
        ← Found
      </Link>
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-950">
        <h1 className="text-2xl font-semibold">{json.title}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{json.description}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500">Type</dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">{json.type}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Location</dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100">{json.location}</dd>
          </div>
        </dl>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.length > 0 ? (
          images.map((imageUrl: string, index: number) => (
            <img
              key={imageUrl + index}
              alt={`${json.title} image ${index + 1}`}
              className="h-72 w-full rounded-xl border object-cover"
              src={imageUrl}
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500 sm:col-span-2 lg:col-span-3">
            No images uploaded for this item.
          </div>
        )}
      </div>
    </div>
  );
}

export default FoundItemView;
