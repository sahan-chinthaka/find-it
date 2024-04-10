"use client";
import React, { useEffect, useState } from "react";
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
import { it } from "node:test";

interface LostItems {
  name: string;
  description: string;
  id: string;
  type: string;
  location: string;
  images: string[];
}

interface User {
  name: string;
  email: string;
  id: string;
  image: string;
}

export default function Page({
  searchParams,
}: {
  searchParams: {
    id: string;
    sugessId: string;
  };
}) {
  let count = 1;
  const [lostItems, setlostItems] = useState<LostItems[]>([]);
  const [userdeatils, setuserdeatils] = useState<User[]>([]);

  useEffect(() => {
    if (count == 1) {
      fetch(`/api/lost/${searchParams.id}`)
        .then((response) => response.json())
        .then((data) => {
          userdata(data.userId);
          const { title, description, id, type, location, images } = data;

          const item = {
            name: title,
            description: description,
            id: id,
            type: type,
            location: location,
            images: images,
          };
          setlostItems((prevItems) => [...prevItems, item]);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }

    count++;
  }, []);

  const userdata = (id: string) => {
    fetch(`/api/user/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const { name, email, image } = data;
        const user = {
          name: name,
          email: email,
          id: id,
          image: image,
        };
        setuserdeatils((prevItems) => [...prevItems, user]);
      });
  };

  const clickreject=()=>{
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

  const clickaccept=()=>{
    const data = {
      id: searchParams.sugessId,
      stages: "Accept",
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
    <>
      {lostItems.map((item) => {
        return (
          <div className="grid w-full pl-6 pr-6 xl:grid-cols-3" key={item.id}>
            <div className="flex flex-col xl:col-span-1 col-span-1 p-5 m-3">
              <Carousel>
                <CarouselContent>
                  {item.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <img src={image} alt="@shadcn" className="w-100 h-100" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
            <div className="flex flex-col xl:col-span-2 col-span-1 p-5 m-3">
              <Card>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
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

                    <TabsContent value="Details">
                      {item.description}
                    </TabsContent>

                    <TabsContent value="Location">
                      <section className="flex items-start py-6">
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
                      <ul>
                        <li><img src={userdeatils[0]?.image} alt="user profile image" /></li>
                        <li className="mt-4">Name: {userdeatils[0]?.name}</li>
                        <li className="mt-1">Email: {userdeatils[0]?.email}</li>
                      </ul>
                      
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter>
                  <Button variant="destructive" onClick={() => clickreject()}>Reject</Button>
                  <Button className="mx-4" onClick={() => clickaccept()}>Accept</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        );
      })}
    </>
  );
}
