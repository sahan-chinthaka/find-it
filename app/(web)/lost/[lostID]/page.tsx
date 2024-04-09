import Link from "next/link";

async function LostItemView({ params }: { params: { lostID: string } }) {
	const { lostID } = params;

	const result = await fetch(process.env.BACKEND + "/api/lost/" + lostID);
	const json = await result.json();

	return (
		<div>
			<Link href={"/lost"} className="text-blue-500">← Lost</Link>
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

export default LostItemView;
