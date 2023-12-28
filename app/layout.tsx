import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "FindIt",
	description: "FindIt is helpful for finding lost things.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
