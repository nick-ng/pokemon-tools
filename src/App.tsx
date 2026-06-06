import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./root";
import Home from "./components/home";
import LinkTradeCode from "./components/link-trade-code";
import FoulPlay from "./components/foul-play";
import MinStat from "./components/min-stat";
import Stopwatches from "./components/stopwatches";
import TeraRaidSuggester from "./components/tera-raid-suggester";
import SvItemPrinter from "./components/sv-item-printer";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		children: [
			{ path: "/", element: <Home /> },
			{ path: "/link-trade-code", element: <LinkTradeCode /> },
			{ path: "/foul-play", element: <FoulPlay /> },
			{ path: "/min-stat", element: <MinStat /> },
			{ path: "/stopwatches", element: <Stopwatches /> },
			{
				path: "/tera-raid",
				element: <TeraRaidSuggester />,
			},
			{ path: "/sv-item-printer", element: <SvItemPrinter /> },
		],
	},
]);

export default function App() {
	return <RouterProvider router={router} />;
}
