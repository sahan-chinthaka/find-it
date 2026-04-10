"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SuggestItems {
  image: string;
  name: string;
  description: string;
  id: string;
  sugessId: string;
}

export default function SuggestTable() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [suggestItems, setSuggestItems] = useState<SuggestItems[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setSuggestItems([]);
      return;
    }

    fetch("/api/suggest/suggestions-optimized")
      .then((response) => response.json())
      .then((data) => {
        setSuggestItems(data.items || []);
      })
      .catch((error) => {
        console.error("Error fetching suggestions:", error);
        setSuggestItems([]);
      });
  }, [isAuthenticated]);

  return (
    <ul className="divide-y divide-slate-200">
      {suggestItems.length === 0 ? (
        <section className="flex items-start  py-6">
          <div className="container flex flex-col items-center px-4 space-y-4">
            <div className="flex flex-col items-center space-y-2 text-center">
              <p className="text-lg font-medium text-slate-500">No suggestion items yet</p>
            </div>

            <img
              alt="GIF"
              className="aspect-square"
              height="150"
              src="https://i.postimg.cc/B6yVSWfW/searching-find.gif"
              width="150"
            />
          </div>
        </section>
      ) : (
        suggestItems.map((item) => (
          <li className="flex items-center justify-between rounded-xl p-4 transition hover:bg-sky-50" key={item.id}>
            {/* <Link href={`suggestion/${item.id}`}> */}
            <Link
              href={{
                pathname: "/suggestion",
                query: {
                  id: item.id,
                  sugessId: item.sugessId,
                },
              }}
            >
              <div className="flex items-center gap-4">
                <img
                  alt="Avatar"
                  className="h-10 w-10 rounded-full border border-slate-200"
                  height="40"
                  src={item.image}
                  style={{
                    aspectRatio: "40/40",
                    objectFit: "cover",
                  }}
                  width="40"
                />
                <div className="grid gap-1.5">
                  <h3 className="font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
              </div>
            </Link>
          </li>
        ))
      )}
    </ul>
  );
}
