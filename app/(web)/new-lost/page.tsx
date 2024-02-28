"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Cities, City } from "@/lib/cities";
import { itemTypes } from "@/lib/item-types";
import { cn, distance } from "@/lib/utils";
import { LostItemSchema } from "@/schema/lost";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

function NewLostPage() {
	const form = useForm<z.infer<typeof LostItemSchema>>({
		resolver: zodResolver(LostItemSchema),
		defaultValues: {
			title: "",
			description: "",
			location: "",
		},
	});
	const { toast } = useToast();
	const formElem = useRef<HTMLFormElement | null>(null);
	const [disable, setDisable] = useState(false);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					let min = Infinity;
					let c: City | undefined;
					for (const city of Cities) {
						const d = distance(city.latitude, city.longitude, pos.coords.latitude, pos.coords.longitude, null);
						if (d < min) {
							min = d;
							c = city;
						}
					}

					if (c) {
						toast({
							title: "Nearest Location Found",
							description: `Set '${c.name}' as your lost location?`,
							action: (
								<ToastAction
									altText="Set location"
									onClick={() => {
										form.setValue("location", c?.name ?? "");
									}}
								>
									Yes
								</ToastAction>
							),
						});
					}
				},
				null,
				{
					enableHighAccuracy: true,
				}
			);
		}
	}, []);

	function onSubmit(values: z.infer<typeof LostItemSchema>) {
		setDisable(true);
		fetch("/api/lost", {
			method: "POST",
			body: JSON.stringify(values),
		})
			.then((res) => res.json())
			.then((res) => {
				if (formElem.current) {
					const form_data = new FormData(formElem.current);
					form_data.append("id", res["id"]);

					fetch("/api/lost", {
						method: "PUT",
						body: form_data,
					})
						.then((res) => res.json())
						.then((res) => {
							console.log(res);
						})
						.finally(() => {
							setDisable(false);
						});
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
									<Input placeholder="Ex: iPhone 14 Pro" {...field} />
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
						name="location"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Location</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												role="combobox"
												className={cn(
													"w-full justify-between overflow-hidden",
													!field.value && "text-muted-foreground"
												)}
											>
												{field.value
													? Cities.find((city) => city.name === field.value)?.name
													: "Choose location"}
												<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-full max-w-[400px] p-0">
										<Command>
											<CommandInput placeholder="Search location..." />
											<CommandEmpty>No location found.</CommandEmpty>
											<CommandGroup>
												{Cities.map((city) => (
													<CommandItem
														value={city.name}
														key={city.name}
														onSelect={() => {
															form.setValue("location", city.name);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																city.name === field.value ? "opacity-100" : "opacity-0"
															)}
														/>
														{city.name}
													</CommandItem>
												))}
											</CommandGroup>
										</Command>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>
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

export default NewLostPage;
