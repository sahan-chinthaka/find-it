import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
	title: "FindIt",
	description: "AI based lost thing founding helper",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body suppressHydrationWarning={true}>
				<Navbar />
				<main>{children}</main>
				<Toaster />
			</body>
		</html>
	);
}
