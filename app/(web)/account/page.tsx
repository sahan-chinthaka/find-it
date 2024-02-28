"use client";

import { useEffect, useState } from "react";

function AccountPage() {
	const [test, setTest] = useState([10, 20, 30]);
	useEffect(() => {
		fetch("/api/user")
	}, []);

	return (
		<div>
			{test.map((i, k) => (
				<h1 key={k}>{i}</h1>
			))}
		</div>
	);
}

export default AccountPage;
