"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { itemTypes } from "@/lib/item-types";
import { LostItemSchema } from "@/schema/lost";
import { Loader } from "@googlemaps/js-api-loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { format } from "date-fns";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export interface Place {
  place_id: string;
  description: string;
  lat: number;
  lng: number;
}

function NewLostPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);
  const [autocompleteSessionToken, setAutocompleteSessionToken] = useState<google.maps.places.AutocompleteSessionToken | null>(
    null,
  );

  const form = useForm<z.infer<typeof LostItemSchema>>({
    resolver: zodResolver(LostItemSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      type: "",
      date: new Date(),
    },
  });

  const formElem = useRef<HTMLFormElement | null>(null);
  const [disable, setDisable] = useState(false);
  const [location, setLocation] = useState<google.maps.LatLngLiteral>();

  useEffect(() => {
    setAutocompleteSessionToken(new google.maps.places.AutocompleteSessionToken());
  }, []);

  useEffect(() => {
    if (!autocompleteSessionToken || !locationQuery.trim()) {
      setSuggestions([]);
      return;
    }

    let isActive = true;
    const timeoutId = setTimeout(async () => {
      try {
        const result = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: locationQuery,
          sessionToken: autocompleteSessionToken,
        });
        if (isActive) {
          setSuggestions(result.suggestions ?? []);
        }
      } catch {
        if (isActive) {
          setSuggestions([]);
        }
      }
    }, 300);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [autocompleteSessionToken, locationQuery]);

  function onSubmit(values: z.infer<typeof LostItemSchema>) {
    // Validate that at least one place has been selected
    if (!places || places.length === 0) {
      alert("Please select at least one location where you might have lost the item");
      return;
    }

    setDisable(true);
    fetch("/api/lost", {
      method: "POST",
      body: JSON.stringify({ ...values, date: format(values.date, "yyyy-MM-dd"), places }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.id) {
          // Validate form element exists
          if (!formElem.current) {
            console.error("Form element not found");
            alert("Error uploading images. Please try again.");
            setDisable(false);
            return;
          }

          const form_data = new FormData(formElem.current);
          form_data.append("id", res.id);

          fetch("/api/lost", {
            method: "PUT",
            body: form_data,
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.id) {
                window.location.href = "/lost";
              } else {
                alert("Error uploading images. Item was created but images failed to upload.");
                setDisable(false);
              }
            })
            .catch((error) => {
              console.error("Error uploading images:", error);
              alert("Error uploading images. Item was created but images failed to upload.");
              setDisable(false);
            });
        } else {
          alert(res.message || "Error creating lost item");
          setDisable(false);
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        alert("Error submitting form. Please try again.");
        setDisable(false);
      });
  }

  return (
    <div className="page-wrap mx-auto max-w-2xl">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Create Report</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Report a Lost Item</h1>
      </div>
      <Form {...form}>
        <form ref={formElem} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What did you lost?</FormLabel>
                <FormControl>
                  <Input autoComplete="off" placeholder="Ex: iPhone 14 Pro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea autoComplete="off" placeholder="Ex: Black color phone with black phone case" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {itemTypes.map((type) => (
                      <SelectGroup key={type.type}>
                        <SelectLabel>{type.type}</SelectLabel>
                        {type.categories.map((category) => (
                          <SelectItem key={category} value={type.type + "-" + category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter places you might lost it</FormLabel>
                <div>
                  {places.length >= 1 && (
                    <>
                      <i className="text-gray-600 text-sm">(Double click to remove item)</i>
                      <br />
                    </>
                  )}
                  {places.map(({ place_id, description }) => (
                    <Fragment key={place_id}>
                      <Badge
                        onDoubleClick={() => {
                          setPlaces((d) => d.filter((p) => p.place_id != place_id));
                        }}
                      >
                        {description}
                      </Badge>
                      <br />
                    </Fragment>
                  ))}
                </div>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Ex: One Galle Face..."
                    value={field.value}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                      field.onChange(e);
                    }}
                    onBlur={field.onBlur}
                    disabled={field.disabled}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div hidden={suggestions.length === 0}>
            <ul className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              {suggestions.map((suggestion) => {
                const placePrediction = suggestion.placePrediction;
                if (!placePrediction) {
                  return null;
                }

                return (
                  <li
                    className="m-1 cursor-pointer rounded-lg border border-transparent bg-slate-50 p-2 text-sm transition hover:border-orange-200 hover:bg-orange-50"
                    onClick={async () => {
                      try {
                        const place = placePrediction.toPlace();
                        if (!place) {
                          console.error("Place object is null");
                          return;
                        }

                        await place.fetchFields({
                          fields: ["displayName", "formattedAddress", "location"],
                        });

                        if (!place.location) {
                          return;
                        }

                        const description = place.formattedAddress ?? place.displayName ?? placePrediction.text?.text ?? "";
                        const place_id = placePrediction.placeId;
                        const position = {
                          lat: place.location.lat(),
                          lng: place.location.lng(),
                        };

                        setPlaces((d) => {
                          if (d.some((p) => p.place_id === place_id)) {
                            return d;
                          }
                          return [...d, { place_id, description, lat: position.lat, lng: position.lng }];
                        });
                        setLocation(position);
                        form.setValue("location", "");
                        setLocationQuery("");
                        setSuggestions([]);
                        setAutocompleteSessionToken(new google.maps.places.AutocompleteSessionToken());
                      } catch (error) {
                        console.error("Error fetching place details:", error);
                      }
                    }}
                    key={placePrediction.placeId}
                  >
                    {placePrediction.text?.text ?? ""}
                  </li>
                );
              })}
            </ul>
          </div>
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string}>
            <div className="h-80 w-full overflow-hidden rounded-2xl border border-slate-200" hidden={!location}>
              <Map gestureHandling="none" center={location} defaultZoom={10} disableDefaultUI mapId="DEMO_MAP_ID">
                <AdvancedMarker position={location} />
              </Map>
            </div>
          </APIProvider>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lost date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                    min="1900-01-01"
                    max={format(new Date(), "yyyy-MM-dd")}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!value) {
                        return;
                      }
                      field.onChange(new Date(`${value}T00:00:00`));
                    }}
                    onBlur={field.onBlur}
                    disabled={field.disabled}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Images</FormLabel>
            <FormControl>
              <Input id="images" name="images" accept="image/*" multiple type="file" />
            </FormControl>
            <FormMessage />
          </FormItem>
          <Button disabled={disable} type="submit" className="w-full rounded-full bg-orange-500 text-white hover:bg-orange-600">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default function Test() {
  const [loaded, setLoaded] = useState(false);
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
      libraries: ["places"],
    });
    loader.load().then(() => {
      setLoaded(true);
    });
  }, [status]);

  if (status === "loading") return "Loading";

  if (status !== "authenticated") {
    return (
      <div className="page-wrap space-y-6">
        <div className="rounded-3xl border border-orange-200/70 bg-gradient-to-r from-orange-50 via-amber-50 to-emerald-50 p-6 shadow-inner">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-700">Create Report</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Report a Lost Item</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">Please log in before creating a lost item report.</p>
          <div className="mt-5">
            <Link href="/api/auth/signin">
              <Button className="rounded-full bg-orange-600 px-6 text-white hover:bg-orange-700">Login to Continue</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!loaded) return "Loading";

  return <NewLostPage />;
}
