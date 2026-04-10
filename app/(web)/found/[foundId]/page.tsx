import Link from "next/link";

export const dynamic = "force-dynamic";

async function FoundItemView({ params }: { params: Promise<{ foundId: string }> }) {
  const { foundId } = await params;

  const result = await fetch(process.env.BACKEND + "/api/found/" + foundId, { cache: "no-store" });
  const json = await result.json();
  const images = Array.isArray(json.images) ? json.images.filter(Boolean) : [];

  return (
    <div className="page-wrap mx-auto max-w-5xl space-y-6">
      <Link href={"/found"} className="text-sm font-semibold text-teal-700 hover:text-teal-800">
        ← Found
      </Link>
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">{json.title}</h1>
        <p className="mt-3 text-slate-600">{json.description}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500">Type</dt>
            <dd className="mt-1 text-sm text-slate-900">{json.type}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Location</dt>
            <dd className="mt-1 text-sm text-slate-900">{json.location}</dd>
          </div>
        </dl>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.length > 0 ? (
          images.map((imageUrl: string, index: number) => (
            <img
              key={imageUrl + index}
              alt={`${json.title} image ${index + 1}`}
              className="h-72 w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
              src={imageUrl}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 sm:col-span-2 lg:col-span-3">
            No images uploaded for this item.
          </div>
        )}
      </div>
    </div>
  );
}

export default FoundItemView;
