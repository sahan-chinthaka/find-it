"use client";
import { useSearchParams } from "next/navigation";
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
import { useEffect, useState } from "react";
import { FoundItem } from "@prisma/client";

interface FoundItems {
  name: string;
  description: string;
  id: string;
  type: string;
  location: string;
  images: number;
}

export default function page() {
  const [foundItems, setFoundItems] = useState<FoundItems[]>([]);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  let count = 1;

  useEffect(() => {
    renderData();
  }, []);

  const renderData = () => {
    if (count == 1) {
      fetch(`/api/found/${id}`)
        .then((response) => response.json())
        .then((data) => {
          const { title, description, id, type, location, images } = data;

          const item = {
            name: title,
            description: description,
            id: id,
            type: type,
            location: location,
            images: images.toString(), // Assuming you want images as a string
          };
          setFoundItems((prevItems) => [...prevItems, item]);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
    count++;
  };

  return (
    <div>
      <>
        {foundItems.map((item, index) => {
          return (
            <div key={index}>
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
                      <CardTitle>{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="Details" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-5">
                          <TabsTrigger value="Details">Details</TabsTrigger>
                          <TabsTrigger value="Contact">Contact</TabsTrigger>
                          <TabsTrigger value="Location">Location</TabsTrigger>
                        </TabsList>

                        <TabsContent value="Details">
                          {item.description}
                        </TabsContent>
                        <TabsContent value="Contact">
                        <section className="flex items-start  py-6">
                            <div className="container flex flex-col items-center px-4 space-y-4">
                              <div className="flex flex-col items-center space-y-2 text-center">
                                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                                  Don't have access yet
                                </p>
                              </div>

                            </div>
                          </section>
                        </TabsContent>
                        <TabsContent value="Location">
                          <section className="flex items-start  py-6">
                            <div className="container flex flex-col items-center px-4 space-y-4">
                              <div className="flex flex-col items-center space-y-2 text-center">
                                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                                  Don't have access yet
                                </p>
                              </div>

                            </div>
                          </section>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                    <CardFooter>
                      <Button variant="destructive">Not mind</Button>
                      <Button className="mx-4">This Mind</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          );
        })}
      </>
    </div>
  );
}
