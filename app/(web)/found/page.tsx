import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth-config";
import { cookiesToString } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function FoundPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.uid) {
    return (
      <div className="page-wrap space-y-6">
        <div className="rounded-3xl border border-teal-200/70 bg-gradient-to-r from-teal-50 via-cyan-50 to-emerald-50 p-6 shadow-inner">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Registry</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Found Items</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
            Log in to view your found items and manage your reports.
          </p>
          <div className="mt-5">
            <Link href="/api/auth/signin">
              <Button className="rounded-full bg-teal-600 px-6 text-white hover:bg-teal-700">Login to Continue</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const c = await cookies();
  const founds = await fetch(process.env.BACKEND + "/api/found/", {
    cache: "no-store",
    headers: {
      Cookie: cookiesToString(c.getAll()),
    },
  });
  const data = await founds.json();
  const foundItems = Array.isArray(data) ? data : [];

  return (
    <div className="page-wrap space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Registry</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Found Items</h1>
        </div>
        <Link href={"/new-found"}>
          <Button size="lg" className="rounded-full bg-teal-600 px-6 text-white hover:bg-teal-700">
            <PlusIcon className="mr-2 h-4 w-4" />
            Report Found Item
          </Button>
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {foundItems.map((a: any) => (
          <Link key={a.id} href={"/found/" + a.id}>
            <div className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-lg">
              {Array.isArray(a.images) && a.images[0] ? (
                <img
                  alt={a.title}
                  className="h-60 w-full object-cover"
                  height={300}
                  src={a.images[0]}
                  style={{
                    aspectRatio: "400/300",
                    objectFit: "cover",
                  }}
                  width={400}
                />
              ) : (
                <div className="flex h-60 items-center justify-center bg-slate-100 text-sm text-slate-500">
                  No image available
                </div>
              )}
              <div className="space-y-1 bg-white/95 p-4">
                <h3 className="line-clamp-1 font-semibold text-lg text-slate-900 md:text-xl">{a.title}</h3>
                <p className="text-sm text-slate-500">Tap to view full details</p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default FoundPage;
