"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface SuggestItems {
  image: string;
  name: string;
  description: string;
  id: string;
  sugessId: string;
  stages: string;
}

export default function Approvetable() {
  const [suggestItems, setSuggestItems] = useState<SuggestItems[]>([]);

  let gocount = 1;
  useEffect(() => {
    if (gocount == 1) {
      fetch("/api/user/")
        .then((response) => response.json())
        .then((data) => {
          if (data == null) {
            console.log("value null")
          } else {
            fetch("/api/suggest/request")
              .then((response) => response.json())
              .then((data) => {
                const lostItemIds = data.flattenedArray;
                lostItemIds.map((item: any) => {
                  // renderTable(item.foundItemId,item.id);
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

                      setSuggestItems((prevItems) => [
                        ...prevItems,
                        suggestItem,
                      ]);
                    })
                    .catch((error) => {
                      console.error("Error fetching data:", error);
                    });
                });
              })
              .catch((error) => {
                console.error("Error fetching user data:", error);
              });
          }
        });
    }
    gocount++;
  }, []);

  return (
    <ul className="divide-y">
      {suggestItems.length === 0 ? (
        <section className="flex items-start  py-6">
          <div className="container flex flex-col items-center px-4 space-y-4">
            <div className="flex flex-col items-center space-y-2 text-center">
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                There are no pending requests for your found item.
              </p>
            </div>
          </div>
        </section>
      ) : (
        suggestItems.map((item) => (
          <li
            className="flex items-center justify-between p-4 hover:bg-gray-100"
            key={item.id}
          >
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
                <div className="grid w-full grid-cols-6 ">
                  <div className="flex flex-col col-span-4 ml-5 ">
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
                  <div className="flex flex-col items-center justify-center col-span-2 ml-5 ">
                    <Button>{item.stages}</Button>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))
      )}
    </ul>
  );
}
