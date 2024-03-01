import { cookiesToString } from "@/lib/utils";
import { cookies } from "next/headers";

async function LostPage() {
	const c = cookies();
	const losts = await fetch(process.env.BACKEND + "/api/lost/", {
		headers: {
			Cookie: cookiesToString(c.getAll()),
		},
	});
	const data = await losts.json();

	return JSON.stringify(data);
}

export default LostPage;
