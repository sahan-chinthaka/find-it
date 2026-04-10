import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authOptions } from "@/lib/auth-config";
import { cookiesToString } from "@/lib/utils";
import { PlusIcon, SearchIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import Link from "next/link";
import FoundItemsClient from "./found-client";

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

      <FoundItemsClient initialItems={foundItems} />
    </div>
  );
}

export default FoundPage;
