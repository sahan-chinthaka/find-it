import { z } from "zod";

export const UserLoginSchema = z.object({
	uname: z.string().min(3, { message: "Email should be valid" }),
	password: z.string().min(1, { message: "Password should not empty" }),
});

export const UserRegisterSchema = z.object({
	uname: z.string().min(3, { message: "Email should be valid" }),
	password: z.string().min(3, { message: "Password should not empty" }),
	name: z.string().min(3, { message: "Name should contains at least 3 characters" }),
});
