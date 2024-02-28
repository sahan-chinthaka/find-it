import { authOptions } from "@/lib/auth-config";
import { getServerSession } from "next-auth";
import Link from "next/link";

async function HomePage() {
	const session = await getServerSession(authOptions);

	return (
		<div>
			<h1>Home {JSON.stringify(session)}</h1>
			<Link href="/api/auth/signin">Sign In</Link><br />
			<Link href="/api/auth/signout">Sign Out</Link><br />
		</div>
	);
}

export default HomePage;
