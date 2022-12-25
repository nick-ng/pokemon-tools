import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MinStat from "./components/min-stat";
import TeraRaidSuggester from "./components/tera-raid-suggester";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TeraRaidSuggester />,
  },
  { path: "/min-stat", element: <MinStat /> },
]);

export default function App() {
  return (
    <div className="mx-4">
      <h1>Pokemon Tools</h1>
      <RouterProvider router={router} />
    </div>
  );
}
