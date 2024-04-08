"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";

export default function HomePage() {
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
                        Total Revenue
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
                      <div className="text-2xl font-bold">$45,231.89</div>
                      <p className="text-xs text-muted-foreground">
                        +20.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Subscriptions
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
                      <div className="text-2xl font-bold">+2350</div>
                      <p className="text-xs text-muted-foreground">
                        +180.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Sales
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
                      <div className="text-2xl font-bold">+12,234</div>
                      <p className="text-xs text-muted-foreground">
                        +19% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Now
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
                      <div className="text-2xl font-bold">+573</div>
                      <p className="text-xs text-muted-foreground">
                        +201 since last hour
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid w-full  xl:grid-cols-2 ">
                  <div className="flex flex-col xl:col-span-1 col-span-1 ml-5 ">
                    <Card>
                      <CardHeader className="flex items-start gap-4">
                        <CardTitle className="text-base">
                          Approve Items
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                          <ul className="divide-y">
                            <li className="flex items-center justify-between p-4 hover:bg-gray-100">
                              <Link href="suggestion/123">
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
                                    <h3 className="font-semibold">Charlie</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      This is regarding my subscription.
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </li>
                            <li className="flex items-center justify-between p-4 hover:bg-gray-100">
                              <Link href="suggestion/123">
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
                                    <h3 className="font-semibold">Charlie</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      This is regarding my subscription.
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </li>
                            <li className="flex items-center justify-between p-4 hover:bg-gray-100">
                              <Link href="suggestion/123">
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
                                    <h3 className="font-semibold">Charlie</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      This is regarding my subscription.
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </li>
                            <li className="flex items-center justify-between p-4 hover:bg-gray-100">
                              <Link href="suggestion/123">
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
                                    <h3 className="font-semibold">Charlie</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      This is regarding my subscription.
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </li>
                          </ul>
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
                          <ul className="divide-y">
                            <li className="flex items-center justify-between p-4 hover:bg-gray-100">
                              <Link href="suggestion/123">
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
                                    <h3 className="font-semibold">Charlie</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      This is regarding my subscription.
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </li>
                            <li className="flex items-center justify-between p-4 hover:bg-gray-100">
                              <Link href="suggestion/123">
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
                                    <h3 className="font-semibold">Charlie</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      This is regarding my subscription.
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </li>
                            <li className="flex items-center justify-between p-4 hover:bg-gray-100">
                              <Link href="suggestion/123">
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
                                    <h3 className="font-semibold">Charlie</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      This is regarding my subscription.
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </li>
                            <li className="flex items-center justify-between p-4 hover:bg-gray-100">
                              <Link href="suggestion/123">
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
                                    <h3 className="font-semibold">Charlie</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      This is regarding my subscription.
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </li>
                          </ul>
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
