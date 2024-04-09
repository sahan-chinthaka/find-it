import Link from "next/link";

async function FoundItemView({ params }: { params: { foundId: string } }) {
	const { foundId } = params;

	const result = await fetch(process.env.BACKEND + "/api/found/" + foundId);
	const json = await result.json();
	console.log(json)

	return (
		<div>
			<Link href={"/found"} className="text-blue-500">← Found</Link>
			<table>
				<tbody>
					<tr>
						<td>Title</td>
						<td>{json.title}</td>
					</tr>
					<tr>
						<td>Description</td>
						<td>{json.description}</td>
					</tr>
					<tr>
						<td>Type</td>
						<td>{json.type}</td>
					</tr>
					<tr>
						<td>Location</td>
						<td>{json.location}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export default FoundItemView;
