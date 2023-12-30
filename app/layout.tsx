import type { Metadata } from "next";
import "./globals.css";
import NavigationBar from "./components/NavigationBar";

export const metadata: Metadata = {
	title: "FindIt",
	description: "FindIt is helpful for finding lost things.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html data-theme="light" lang="en">
			<body>
				<NavigationBar />
				{children}
			</body>
		</html>
	);
}
