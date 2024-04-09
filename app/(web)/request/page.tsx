import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function Page() {
  return (
    <>
      <div className="grid w-full pl-6 pr-6  xl:grid-cols-3 ">
        <div className="flex flex-col xl:col-span-1 col-span-1 p-5 m-3 ">
          <Carousel>
            <CarouselContent>
              <CarouselItem>
                <img
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="w-100 h-100"
                />
              </CarouselItem>
              <CarouselItem>
                <img
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="w-100 h-100"
                />
              </CarouselItem>
              <CarouselItem>
                <img
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="w-100 h-100"
                />
              </CarouselItem>
              <CarouselItem>
                <img
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                  className="w-100 h-100"
                />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
        <div className="flex flex-col xl:col-span-2 col-span-1 p-5 m-3 ">
          <Card>
            <CardHeader>
              <CardTitle>23123</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="Details" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-5">
                  <TabsTrigger value="Details">Details</TabsTrigger>
                  <TabsTrigger value="Location">Location</TabsTrigger>
                  <TabsTrigger value="Contact">
                    Request person details
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="Details">123123</TabsContent>

                <TabsContent value="Location">
                  <section className="flex items-start  py-6">
                    <div className="container flex flex-col items-center px-4 space-y-4">
                      <div className="flex flex-col items-center space-y-2 text-center">
                        <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                          Do not have access yet
                        </p>
                      </div>
                    </div>
                  </section>
                </TabsContent>
                <TabsContent value="Contact">
                  <section className="flex items-start  py-6">
                    <div className="container flex flex-col items-center px-4 space-y-4">
                      <div className="flex flex-col items-center space-y-2 text-center">
                        <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                          Do not have access yet
                        </p>
                      </div>
                    </div>
                  </section>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="destructive">Reject</Button>
              <Button className="mx-4">Accept</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
