import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./root";
import LinkTradeCode from "./components/link-trade-code";
import FoulPlay from "./components/foul-play";
import MinStat from "./components/min-stat";
import Stopwatches from "./components/stopwatches";
import TeraRaidSuggester from "./components/tera-raid-suggester";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <MinStat /> },
      { path: "/link-trade-code", element: <LinkTradeCode /> },
      { path: "/foul-play", element: <FoulPlay /> },
      { path: "/min-stat", element: <MinStat /> },
      { path: "/stopwatches", element: <Stopwatches /> },
      {
        path: "/tera-raid",
        element: <TeraRaidSuggester />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
