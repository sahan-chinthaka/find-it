"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { itemTypes } from "@/lib/item-types";
import { cn } from "@/lib/utils";
import { FoundItemSchema } from "@/schema/found";
import { zodResolver } from "@hookform/resolvers/zod";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import usePlacesAutoComplete, { getGeocode, getLatLng } from "use-places-autocomplete";
import { z } from "zod";
import { Place } from "../new-lost/page";
import { useRouter } from "next/navigation";
import { Loader } from "@googlemaps/js-api-loader";

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
	const router = useRouter();

	const [location, setLocation] = useState<Place>();
	const formElem = useRef<HTMLFormElement>(null);

	const places = usePlacesAutoComplete({
		debounce: 300,
	});

	function onSubmit(values: z.infer<typeof FoundItemSchema>) {
		setDisable(true);
		fetch("/api/found", {
			method: "POST",
			body: JSON.stringify({ ...values, place: location }),
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
						}).finally(() => setDisable(false));
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
							<FormItem className="flex flex-col">
								<FormLabel>Found date</FormLabel>
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
											places.setValue(e.target.value);
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
					<div hidden={places.suggestions.status != "OK"}>
						<ul>
							{places.suggestions.data.map(({ place_id, description }) => (
								<li
									className="bg-slate-50 p-1 m-1 rounded-lg"
									onClick={async () => {
										places.setValue(description, false);
										form.setValue("location", description);
										places.clearSuggestions();
										const result = await getGeocode({ address: description });
										const position = getLatLng(result[0]);
										setLocation({
											...position,
											description,
											place_id,
										});
									}}
									key={place_id}
								>
									{description}
								</li>
							))}
						</ul>
					</div>
					<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API as string}>
						{location && (
							<div className="w-full h-80">
								<Map streetViewControl={false} gestureHandling="none" center={location} defaultZoom={10}>
									<Marker position={location}></Marker>
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

	return <NewFoundPage />;
}
