"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface LostItem {
  id: string;
  title: string;
  description: string;
  type: string;
  images: string[];
  location: string;
}

export default function LostItemsClient({ initialItems }: { initialItems: LostItem[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Get unique types for filtering
  const types = useMemo(() => {
    return Array.from(new Set(initialItems.map((item) => item.type)));
  }, [initialItems]);

  // Filter items based on search and type
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = !typeFilter || item.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [initialItems, searchQuery, typeFilter]);

  return (
    <>
      <div className="space-y-4">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[250px] relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by title, description, or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        
        <p className="text-sm text-slate-600">
          Showing {filteredItems.length} of {initialItems.length} items
        </p>
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-slate-600">No lost items match your search criteria.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((a) => (
            <Link key={a.id} href={"/lost/" + a.id}>
              <div className="group h-full overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg">
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
                  <p className="line-clamp-2 text-sm text-slate-600">{a.description}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                      {a.type}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </>
  );
}
