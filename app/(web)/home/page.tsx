"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as React from "react";

import Acceptable from "@/components/acceptTable";
import Approvetable from "@/components/approvetable";
import SuggestTable from "@/components/suggestTable";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [suggestItemcount, setsuggestItemcount] = useState<number>(0);
  const [lostmcount, setlostmcount] = useState<number>(0);
  const [foundmcount, setfoundmcount] = useState<number>(0);

  React.useEffect(() => {
    if (!isAuthenticated) {
      setsuggestItemcount(0);
      setlostmcount(0);
      setfoundmcount(0);
      return;
    }

    Promise.all([fetch("/api/suggest/get"), fetch("/api/lost/"), fetch("/api/found/")])
      .then(async ([suggestRes, lostRes, foundRes]) => {
        const [suggestData, lostData, foundData] = await Promise.all([suggestRes.json(), lostRes.json(), foundRes.json()]);

        setsuggestItemcount(suggestData.flattenedArray.length);
        setlostmcount(lostData.length);
        setfoundmcount(foundData.length);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
  }, [isAuthenticated]);

  return (
    <div className="page-wrap space-y-6">
      <div className="rounded-3xl border border-orange-200/70 bg-gradient-to-r from-orange-50 via-amber-50 to-emerald-50 p-6 shadow-inner">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-700">Control Center</p>
        {isAuthenticated ? (
          <>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Hi, welcome back</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
              Track every report, review possible matches, and help reunite lost items with their owners.
            </p>
          </>
        ) : (
          <>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Welcome to FindIt</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
              Sign in to view your dashboard, suggestions, and request queues.
            </p>
            <div className="mt-5">
              <Link href="/api/auth/signin">
                <Button className="rounded-full bg-orange-600 px-6 text-white hover:bg-orange-700">Login to Continue</Button>
              </Link>
            </div>
          </>
        )}
      </div>

      {isAuthenticated ? (
        <ScrollArea className="h-full">
          <div className="flex-1 space-y-4">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="glass-card border-orange-200/70">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total lost items</CardTitle>
                      <div className="rounded-lg bg-orange-100 p-2 text-orange-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4"
                        >
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-slate-900">{lostmcount}</div>
                    </CardContent>
                  </Card>
                  <Card className="glass-card border-teal-200/70">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total found items</CardTitle>
                      <div className="rounded-lg bg-teal-100 p-2 text-teal-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-slate-900">{foundmcount}</div>
                    </CardContent>
                  </Card>
                  <Card className="glass-card border-sky-200/70">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Suggestion items</CardTitle>
                      <div className="rounded-lg bg-sky-100 p-2 text-sky-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4"
                        >
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <path d="M2 10h20" />
                        </svg>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-slate-900">{suggestItemcount}</div>
                    </CardContent>
                  </Card>
                  <Card className="glass-card border-emerald-200/70">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Items reunited</CardTitle>
                      <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="h-4 w-4"
                        >
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-slate-900">0</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid w-full gap-4 xl:grid-cols-2">
                  <div className="flex flex-col">
                    <Card className="glass-card">
                      <CardHeader className="flex items-start gap-2 border-b border-slate-100">
                        <CardTitle className="text-base font-semibold">Accept Items</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ScrollArea className="h-[340px] w-full p-4">
                          <Acceptable />
                          <Approvetable />
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex flex-col">
                    <Card className="glass-card">
                      <CardHeader className="flex items-start gap-2 border-b border-slate-100">
                        <CardTitle className="text-base font-semibold">Suggestion Items</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ScrollArea className="h-[340px] w-full p-4">
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
      ) : null}
    </div>
  );
}
