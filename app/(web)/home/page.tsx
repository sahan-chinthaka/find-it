"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import SuggestTable from "@/components/suggestTable";
import Approvetable from "@/components/approvetable";
import Acceptable from "@/components/acceptTable";
import { useState } from "react";

export default function HomePage() {
  const [suggestItemcount, setsuggestItemcount] = useState<number>(0);
  const [lostmcount, setlostmcount] = useState<number>(0);
  const [foundmcount, setfoundmcount] = useState<number>(0);



  let gocount = 1;
  React.useEffect(() => {
    if (gocount == 1) {
      fetch("/api/user/")
        .then((response) => response.json())
        .then((data) => {
          if (data == null) {
            console.log("value null");
          } else {
            fetch("/api/suggest/get")
              .then((response) => response.json())
              .then((data) => {

                setsuggestItemcount(data.flattenedArray.length);

                const lostItemIds = data.flattenedArray;
                lostItemIds.map((item: any) => {
                  // renderTable(item.foundItemId,item.id);
                  fetch(`/api/found/${item.foundItemId}`)
                    .then((response) => response.json())
                    .then((data) => {
                      // console.log(data)
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

        fetch("/api/lost/")
        .then((response) => response.json())
        .then((data) => {
          setlostmcount(data.length)
        })

        fetch("/api/found/")
        .then((response) => response.json())
        .then((data) => {
          setfoundmcount(data.length)
        })


    }
    gocount++;
  }, []);


  return (
    <div>
      <div>
        <ScrollArea className="h-full">
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">
                Hi, Welcome back 👋
              </h2>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total lost item
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{lostmcount}</div>
                      <p className="text-xs text-muted-foreground"></p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Found Item
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{foundmcount}</div>
                      <p className="text-xs text-muted-foreground"></p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Suggestion Items
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{suggestItemcount}</div>
                      <p className="text-xs text-muted-foreground"></p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                      Total founded Item
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">0</div>
                      <p className="text-xs text-muted-foreground"></p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid w-full  xl:grid-cols-2 ">
                  <div className="flex flex-col xl:col-span-1 col-span-1 ml-5 ">
                    <Card>
                      <CardHeader className="flex items-start gap-4">
                        <CardTitle className="text-base">
                          Accept Items
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                          <Acceptable />
                          <Approvetable />
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex flex-col xl:col-span-1 col-span-1 ml-5 ">
                    <Card>
                      <CardHeader className="flex items-start gap-4">
                        <CardTitle className="text-base">
                          Suggestion Items
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                          <SuggestTable />
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
