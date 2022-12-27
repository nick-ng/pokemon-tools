import { Outlet } from "react-router-dom";

import Nav from "./components/nav";

export default function Root() {
  return (
    <div className="mx-4">
      <h1>Pokemon Tools</h1>
      <div className="flex flex-col md:flex-row">
        <details className="md:hidden">
          <summary>Nav</summary>
          <Nav />
        </details>
        <div className="mt-1 mr-2 hidden align-top md:block">
          <Nav />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
