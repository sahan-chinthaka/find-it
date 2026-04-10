"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { itemTypes } from "@/lib/item-types";
import { cn } from "@/lib/utils";
import { LostItemSchema } from "@/schema/lost";
import { Loader } from "@googlemaps/js-api-loader";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdvancedMarker, APIProvider, Map } from "@vis.gl/react-google-maps";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
	const [autocompleteSessionToken, setAutocompleteSessionToken] =
		useState<google.maps.places.AutocompleteSessionToken | null>(null);

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
		setDisable(true);
		fetch("/api/lost", {
			method: "POST",
			body: JSON.stringify({ ...values, places }),
		})
			.then((res) => res.json())
			.then((res) => {
				console.log(res);
				if (formElem.current) {
					const form_data = new FormData(formElem.current);

					if (res.id) {
						form_data.append("id", res["id"]);
						const lostId = res.id;
						fetch("/api/lost", {
							method: "PUT",
							body: form_data,
						})
							.then((res) => res.json())
							.then((res) => {
								console.log(res);
								window.location.href = "/lost";
							})
							.finally(() => {
								setDisable(false);
							});
					}
				}
			});
	}

	return (
		<div className="max-w-[450px] mx-auto p-4 rounded shadow-md">
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
									<Textarea
										autoComplete="off"
										placeholder="Ex: Black color phone with black phone case"
										{...field}
									/>
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
						<ul>
							{suggestions.map((suggestion) => {
								const placePrediction = suggestion.placePrediction;
								if (!placePrediction) {
									return null;
								}

								return (
									<li
										className="bg-slate-50 p-1 m-1 rounded-lg"
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

												const description =
													place.formattedAddress ?? place.displayName ?? placePrediction.text?.text ?? "";
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
						<div className="w-full h-80" hidden={!location}>
							<Map gestureHandling="none" center={location} defaultZoom={10} disableDefaultUI mapId="DEMO_MAP_ID">
								<AdvancedMarker position={location} />
							</Map>
						</div>
					</APIProvider>
					<FormField
						control={form.control}
						name="date"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Lost date</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={"outline"}
												className={cn(
													"w-[240px] pl-3 text-left font-normal",
													!field.value && "text-muted-foreground"
												)}
											>
												{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
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
					<Button disabled={disable} type="submit">
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

	return <NewLostPage />;
}
