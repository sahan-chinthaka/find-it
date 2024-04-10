import { Button } from "@/components/ui/button";
import { cookiesToString } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function LostPage() {
	const c = cookies();
	const founds = await fetch(process.env.BACKEND + "/api/lost/", {
		headers: {
			Cookie: cookiesToString(c.getAll()),
		},
	});
	const data = await founds.json();

	return (
		<>
			<div className="flex justify-start p-4 mx-7">
				<Link href={"/new-lost"}>
					<Button size="lg" variant="outline" className="bg-green-200">
						<PlusIcon className="mr-2 h-4 w-4" />
						New lost
					</Button>
				</Link>
			</div>
			<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 md:p-6 mx-7">
				{data.map((a: any) => (
					<Link key={a.id} href={"/lost/" + a.id}>
						<div className="border-dashed border border-gray-400 rounded-lg dark:border-gray-800 dark:hover:border-gray-50">
							<img
								alt="Product 1"
								className="object-cover w-full h-60"
								height={300}
								src={a.images[0]}
								style={{
									aspectRatio: "400/300",
									objectFit: "cover",
								}}
								width={400}
							/>
							<div className="bg-white p-4 dark:bg-gray-950">
								<h3 className="font-semibold text-lg md:text-xl">{a.title}</h3>
							</div>
						</div>
					</Link>
				))}
			</section>
		</>
	);
}
