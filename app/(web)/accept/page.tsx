"use client";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    stages: string;
  };
}) {
  let count = 1;
  const [lostItems, setlostItems] = useState<LostItems[]>([]);
  const [userdeatils, setuserdeatils] = useState<User[]>([]);

  useEffect(() => {
    if (count == 1) {
      fetch(`/api/found/${searchParams.id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
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

  const clickreject = () => {
    const data = {
      id: searchParams.sugessId,
      stages: "Delete",
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
  };

  const clickdone = () => {
    const data = {
      id: searchParams.sugessId,
      stages: "Done",
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
  };
  return (
    <div className="page-wrap">
      {lostItems.map((item) => {
        return (
          <div className="grid w-full gap-5 xl:grid-cols-3" key={item.id}>
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
                      <TabsTrigger value="Location">Location</TabsTrigger>
                      <TabsTrigger value="Contact">Posted person details</TabsTrigger>
                    </TabsList>

                    <TabsContent value="Details">{item.description}</TabsContent>

                    <TabsContent value="Location">{item.location}</TabsContent>

                    <TabsContent value="Contact">
                      <ul>
                        <li>
                          <img src={userdeatils[0]?.image} alt="user profile image" />
                        </li>
                        <li className="mt-4">Name: {userdeatils[0]?.name}</li>
                        <li className="mt-1">Email: {userdeatils[0]?.email}</li>
                      </ul>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="gap-3">
                  <Button variant="destructive" className="rounded-full" onClick={() => clickreject()}>
                    Reject
                  </Button>
                  <Button className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => clickdone()}>
                    Done
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        );
      })}
    </div>
  );
}
