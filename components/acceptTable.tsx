"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

interface SuggestItems {
  image: string;
  name: string;
  description: string;
  id: string;
  sugessId: string;
  stages: string;
}

export default function Acceptable() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [suggestItems, setSuggestItems] = useState<SuggestItems[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setSuggestItems([]);
      return;
    }

    fetch("/api/suggest/accept")
      .then((response) => response.json())
      .then((data) => {
        const lostItemIds = data.flattenedArray;
        setSuggestItems([]);
        lostItemIds.map((item: any) => {
          fetch(`/api/found/${item.foundItemId}`)
            .then((response) => response.json())
            .then((data) => {
              const { id, title, description, images } = data;
              const suggestItem = {
                image: images.toString(),
                name: title,
                description: description,
                id: id,
                sugessId: item.id,
                stages: item.stages,
              };

              setSuggestItems((prevItems) => [...prevItems, suggestItem]);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [isAuthenticated]);

  return (
    <ul className="divide-y divide-slate-200">
      {suggestItems.map((item) => (
        <div key={item.id}>
          <li className="flex items-center justify-between rounded-xl p-4 transition hover:bg-orange-50" key={item.id}>
            <Link
              href={{
                pathname: "/accept",
                query: {
                  id: item.id,
                  sugessId: item.sugessId,
                  stages: item.stages,
                },
              }}
            >
              <div className="flex items-center gap-4">
                <div className="grid w-full grid-cols-6 ">
                  <div className="flex flex-col col-span-4 ml-5 ">
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
                  <div className="flex flex-col items-center justify-center col-span-2 ml-5 ">
                    <Button className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700">{item.stages}</Button>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        </div>
      ))}
    </ul>
  );
}
