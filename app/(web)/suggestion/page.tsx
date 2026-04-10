"use client";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

interface FoundItems {
  name: string;
  description: string;
  id: string;
  type: string;
  location: string;
  images: string[];
}

export default function page({
  searchParams,
}: {
  searchParams: {
    id: string;
    sugessId: string;
  };
}) {
  const [foundItems, setFoundItems] = useState<FoundItems[]>([]);

  let count = 1;

  useEffect(() => {
    if (count == 1) {
      fetch(`/api/found/${searchParams.id}`)
        .then((response) => response.json())
        .then((data) => {
          const { title, description, id, type, location, images } = data;

          const item = {
            name: title,
            description: description,
            id: id,
            type: type,
            location: location,
            images: images, // Assuming you want images as a string
          };
          setFoundItems((prevItems) => [...prevItems, item]);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
    count++;
  }, []);

  function notmindbtn() {
    const data = {
      id: searchParams.sugessId,
      stages: "Wrong",
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(`/api/suggest/stages`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log("Request sent successfully");
        console.log(response);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  function thismindbtn() {
    const data = {
      id: searchParams.sugessId,
      stages: "Request",
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(`/api/suggest/stages`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log("Request sent successfully");
        console.log(response);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  return (
    <div className="page-wrap">
      <>
        {foundItems.map((item, index) => {
          return (
            <div key={index}>
              <div className="grid w-full gap-5 xl:grid-cols-3">
                <div className="flex flex-col xl:col-span-1 col-span-1">
                  <Carousel>
                    <CarouselContent>
                      {item.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <img
                            src={image}
                            alt="@shadcn"
                            className="h-[420px] w-full rounded-2xl border border-slate-200 object-cover"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
                <div className="flex flex-col xl:col-span-2 col-span-1">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-2xl">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="Details" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-5">
                          <TabsTrigger value="Details">Details</TabsTrigger>
                          <TabsTrigger value="Contact">Contact</TabsTrigger>
                          <TabsTrigger value="Location">Location</TabsTrigger>
                        </TabsList>

                        <TabsContent value="Details">{item.description}</TabsContent>
                        <TabsContent value="Contact">
                          <section className="flex items-start  py-6">
                            <div className="container flex flex-col items-center px-4 space-y-4">
                              <div className="flex flex-col items-center space-y-2 text-center">
                                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Do not have access yet</p>
                              </div>
                            </div>
                          </section>
                        </TabsContent>
                        <TabsContent value="Location">
                          <section className="flex items-start  py-6">
                            <div className="container flex flex-col items-center px-4 space-y-4">
                              <div className="flex flex-col items-center space-y-2 text-center">
                                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">Do not have access yet</p>
                              </div>
                            </div>
                          </section>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                    <CardFooter className="gap-3">
                      <Button variant="destructive" className="rounded-full" onClick={() => notmindbtn()}>
                        Not mine
                      </Button>
                      <Button className="rounded-full bg-teal-600 text-white hover:bg-teal-700" onClick={() => thismindbtn()}>
                        This Mine
                      </Button>
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
