

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

export default function page() {
  return (
    <div>
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
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="Details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-5">
                    <TabsTrigger value="Details">Details</TabsTrigger>
                    <TabsTrigger value="Contact">Contact</TabsTrigger>
                    <TabsTrigger value="Location">Location</TabsTrigger>
                  </TabsList>

                  <TabsContent value="Details">
                    This is just a template, and you should tailor it according
                    to the specifics of your product and the requirements of
                    your website or platform. If you provide more details about
                    the product or the type of demo you&apos;re looking for, I
                    can offer a more customized example.
                  </TabsContent>
                  <TabsContent value="Contact">
                    It seems like  asking for a demo of product details.
                    However, without specific context about the product or the
                    type of details  looking for, I can only provide a
                    general example. Here is a basic demo of product details:
                    Product Name: [Name of the Product] Description: [Brief
                    description of the product] Price: [Price of the product]
                  </TabsContent>
                  <TabsContent value="Location">
                    Features: [Feature 1] [Feature 2] [Feature 3] ...
                    Specifications:
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
      </>
    </div>
  );
}
