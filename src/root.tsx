import { Outlet } from "react-router-dom";

import Nav from "./components/nav";

export default function Root() {
	return (
		<div className="mx-4">
			<h1 className="hidden md:block">Pokemon Tools</h1>
			<details className="md:hidden">
				<summary className="text-2xl">Poke Tools</summary>
				<Nav />
			</details>
			<div className="flex flex-col md:flex-row">
				<div className="mt-1 mr-2 hidden align-top md:block">
					<Nav />
				</div>
				<Outlet />
			</div>
		</div>
	);
}
