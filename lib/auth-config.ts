import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		CredentialsProvider({
			name: "credentials",
			credentials: {
				uname: { label: "User name", type: "text", placeholder: "User name" },
				password: { label: "Password", type: "password", placeholder: "Password" },
			},
			async authorize(credentials) {
				if (!credentials?.uname || !credentials?.password) {
					throw new Error("Please enter an user name and password");
				}

				const user = await prisma.user.findUnique({
					where: {
						uname: credentials.uname,
					},
				});

				if (!user || !user?.password) {
					throw new Error("No user found");
				}

				const passwordMatch = await bcrypt.compare(credentials.password, user.password);

				if (!passwordMatch) {
					throw new Error("Incorrect password");
				}

				return user;
			},
		}),
	],
	secret: process.env.AUTH_SECRET,
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async session({ session, token }) {
			if (session.user) {
				if (token.sub) session.user.uid = token.sub;
				if (token.uname) session.user.uname = token.uname as string;
			}
			return session;
		},
		async jwt({ token }) {
			const existingUser = await prisma.user.findUnique({
				where: {
					id: token.sub,
				},
			});
			if (existingUser) {
				token.uname = existingUser.uname;
			}
			return token;
		},
	},
	debug: false,
};
