import { z } from "zod";

export const FoundItemSchema = z.object({
	title: z.string().min(3, {
		message: "Title must be at least 3 characters.",
	}),
	description: z.string().min(5, {
		message: "Description must be at least 5 characters.",
	}),
	type: z.string().min(1, {
		message: "Please select a type",
	}),
	location: z.string().min(1, {
		message: "Enter a location"
	}),
	date: z.date(),
});
