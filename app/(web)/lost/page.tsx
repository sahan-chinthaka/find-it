import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth-config";
import { cookiesToString } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import Link from "next/link";
import LostItemsClient from "./lost-client";

export const dynamic = "force-dynamic";

export default async function LostPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.uid) {
    return (
      <div className="page-wrap space-y-6">
        <div className="rounded-3xl border border-orange-200/70 bg-gradient-to-r from-orange-50 via-amber-50 to-emerald-50 p-6 shadow-inner">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-700">Registry</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Lost Items</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
            Log in to view your lost items and manage your reports.
          </p>
          <div className="mt-5">
            <Link href="/api/auth/signin">
              <Button className="rounded-full bg-orange-600 px-6 text-white hover:bg-orange-700">Login to Continue</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const c = await cookies();
  const founds = await fetch(process.env.BACKEND + "/api/lost/", {
    cache: "no-store",
    headers: {
      Cookie: cookiesToString(c.getAll()),
    },
  });
  const data = await founds.json();
  const lostItems = Array.isArray(data) ? data : [];

  return (
    <div className="page-wrap space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Registry</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Lost Items</h1>
        </div>
        <Link href={"/new-lost"}>
          <Button size="lg" className="rounded-full bg-orange-500 px-6 text-white hover:bg-orange-600">
            <PlusIcon className="mr-2 h-4 w-4" />
            Report Lost Item
          </Button>
        </Link>
      </div>

      <LostItemsClient initialItems={lostItems} />
    </div>
  );
}
