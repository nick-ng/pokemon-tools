import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./root";
import MinStat from "./components/min-stat";
import TeraRaidSuggester from "./components/tera-raid-suggester";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <MinStat /> },
      { path: "/min-stat", element: <MinStat /> },
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
