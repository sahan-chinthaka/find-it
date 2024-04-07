"use client";

import { SessionProvider } from "next-auth/react";
import HomePage from "./(web)/home/page";

export default function IndexPage() {
	return (
		<SessionProvider>
			<HomePage />
		</SessionProvider>
	);
}