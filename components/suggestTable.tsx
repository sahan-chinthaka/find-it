"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

interface SuggestItems {
  image: string;
  name: string;
  description: string;
  id: string;
}

export default function suggestTable() {
  const [suggestItems, setSuggestItems] = useState<SuggestItems[]>([]);

  useEffect(() => {
    setSuggestItems([]);
    fetchData();
  }, []);

  const fetchData = async () => {
    fetch("/api/suggest/get")
      .then((response) => response.json())
      .then((data) => {
        const lostItemIds = data.lostItemIds;
        lostItemIds.map((item: any) => {
          renderTable(item);
        });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  };

  const renderTable = (id: string) => {
    fetch(`/api/found/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const { id, title, description, images } = data;
        const suggestItem = {
          image: images.toString(),
          name: title,
          description: description,
          id: id,
        };
        setSuggestItems((prevItems) => [...prevItems, suggestItem]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <ul className="divide-y">
      {suggestItems.map((item) => (
        <li className="flex items-center justify-between p-4 hover:bg-gray-100">
          <Link href={`suggestion/${item.id}`}>
            <div className="flex items-center gap-4">
              <img
                alt="Avatar"
                className="rounded-full"
                height="40"
                src="https://github.com/shadcn.png"
                style={{
                  aspectRatio: "40/40",
                  objectFit: "cover",
                }}
                width="40"
              />
              <div className="grid gap-1.5">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
