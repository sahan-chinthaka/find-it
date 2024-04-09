import { cookiesToString } from "@/lib/utils";
import { cookies } from "next/headers";
import Link from "next/link";

async function FoundPage() {
	const c = cookies();
	const founds = await fetch(process.env.BACKEND + "/api/found/", {
		headers: {
			Cookie: cookiesToString(c.getAll()),
		},
	});
	const data = await founds.json();

	return (
		<div>
			<Link className="text-blue-500" href={"/new-found"}>New Found</Link>
			{data.map((a: any) => (
				<div key={a.id} className="p-2 m-2 bg-slate-200">
					<p>{a.title}</p>
					<p>{a.description}</p>
					<p><Link className="text-blue-500" href={"/found/" + a.id}>Details</Link></p>
				</div>
			))}
		</div>
	);
}

export default FoundPage;
