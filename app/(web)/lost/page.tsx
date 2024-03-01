import { cookiesToString } from "@/lib/utils";
import { cookies } from "next/headers";
import Link from "next/link";

async function LostPage() {
	const c = cookies();
	const losts = await fetch(process.env.BACKEND + "/api/lost/", {
		headers: {
			Cookie: cookiesToString(c.getAll()),
		},
	});
	const data = await losts.json();

	return (
		<div>
			<Link className="text-blue-500" href={"/new-lost"}>New lost</Link>
			{data.map((a: any) => (
				<div className="p-2 m-2 bg-slate-200">
					<p>{a.title}</p>
					<p>{a.description}</p>
					<p><Link className="text-blue-500" href={"/lost/" + a.id}>Details</Link></p>
				</div>
			))}
		</div>
	);
}

export default LostPage;
