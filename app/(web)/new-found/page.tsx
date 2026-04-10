"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { itemTypes } from "@/lib/item-types";
import { FoundItemSchema } from "@/schema/found";
import { Loader } from "@googlemaps/js-api-loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Place } from "../new-lost/page";

function NewFoundPage() {
  const [disable, setDisable] = useState(false);
  const form = useForm<z.infer<typeof FoundItemSchema>>({
    resolver: zodResolver(FoundItemSchema),
    defaultValues: {
      location: "",
      title: "",
      description: "",
      type: "",
      date: new Date(),
    },
  });

  const [location, setLocation] = useState<Place>();
  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);
  const [autocompleteSessionToken, setAutocompleteSessionToken] = useState<google.maps.places.AutocompleteSessionToken | null>(
    null,
  );
  const formElem = useRef<HTMLFormElement>(null);

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

  function onSubmit(values: z.infer<typeof FoundItemSchema>) {
    setDisable(true);
    fetch("/api/found", {
      method: "POST",
      body: JSON.stringify({ ...values, date: format(values.date, "yyyy-MM-dd"), place: location }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.message == "done") {
          const form_data = new FormData(formElem.current ?? undefined);
          form_data.append("foundId", res.foundId);
          const foundId = res.foundId;

          fetch("/api/found", {
            method: "PUT",
            body: form_data,
          })
            .then((res) => res.json())
            .then((res) => {
              console.log(res);
              window.location.href = "/found";
            })
            .finally(() => setDisable(false));
        }
      });
  }

  return (
    <div className="page-wrap mx-auto max-w-2xl">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Create Report</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Report a Found Item</h1>
      </div>
      <Form {...form}>
        <form ref={formElem} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What did you found?</FormLabel>
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
                  <Textarea placeholder="Ex: Black color phone with black phone case" {...field} />
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
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Found date</FormLabel>
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
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where did you found it?</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    placeholder="Ex: Colombo..."
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
                    className="m-1 cursor-pointer rounded-lg border border-transparent bg-slate-50 p-2 text-sm transition hover:border-teal-200 hover:bg-teal-50"
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
                        setLocation({
                          lat: place.location.lat(),
                          lng: place.location.lng(),
                          description,
                          place_id: placePrediction.placeId,
                        });
                        form.setValue("location", description);
                        setLocationQuery(description);
                      } catch (error) {
                        console.error("Error fetching place details:", error);
                      }
                      setSuggestions([]);
                      setAutocompleteSessionToken(new google.maps.places.AutocompleteSessionToken());
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
            {location && (
              <div className="h-80 w-full overflow-hidden rounded-2xl border border-slate-200">
                <Map streetViewControl={false} gestureHandling="none" center={location} defaultZoom={10} mapId="DEMO_MAP_ID">
                  <AdvancedMarker position={location}></AdvancedMarker>
                </Map>
              </div>
            )}
          </APIProvider>
          <FormItem>
            <FormLabel>Images</FormLabel>
            <FormControl>
              <Input id="images" name="images" accept="image/*" multiple type="file" />
            </FormControl>
            <FormMessage />
          </FormItem>
          <Button disabled={disable} type="submit" className="w-full rounded-full bg-teal-600 text-white hover:bg-teal-700">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default function Test() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string,
      libraries: ["places"],
    });
    loader.load().then(() => {
      setLoaded(true);
    });
  }, []);

  if (!loaded) return "Loading";

  return <NewFoundPage />;
}
