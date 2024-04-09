import { expect, test } from "vitest";

test("Create a new lost without a body", async () => {
	const res = await fetch("http://localhost:3000/api/lost", {
		method: "POST",
		body: JSON.stringify({}),
	});

	const out = await res.json();
	expect(out.error).toBeTruthy();
});

test("Create a new lost without a user", async () => {
	const res = await fetch("http://localhost:3000/api/lost", {
		method: "POST",
		body: JSON.stringify({
			title: "iPhone 14 Pro",
			description: "Black color iPhone. IMEI number is 50003254882212",
			location: "Colombo",
			date: new Date(),
			type: "Other",
			userId: "random",
			places: [
				{
					place_id: "random",
					description: "Colombo",
					lat: 8.5,
					lng: 90,
				},
			],
		}),
	});

	const out = await res.json();
	expect(out.message).toBe("No user");
});
