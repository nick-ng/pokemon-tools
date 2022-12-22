import MinStat from "./components/min-stat";
import TeraRaidSuggester from "./components/tera-raid-suggester";

export default function App() {
  return (
    <div className="mx-4">
      <h1>Pokemon Tools</h1>
      <MinStat />
      <TeraRaidSuggester />
    </div>
  );
}
