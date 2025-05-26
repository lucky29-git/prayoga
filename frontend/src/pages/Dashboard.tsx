import YamlEditor from "../components/YamlEditor";
import DashboardForm from "../components/DashboardForm";
import { Button } from "../components/ui/button";
import { useState } from "react";

export default function Dashboard() {
  const [showYaml, setShowYaml] = useState(true);
  // Get username from localStorage (if available)
  const username = localStorage.getItem("username");

  return (
    <div className="flex flex-col gap-6 mt-8 items-center">
      {username && (
        <div className="text-xl font-semibold mb-2">Welcome, {username}!</div>
      )}
      <div className="flex gap-2">
        <Button onClick={() => setShowYaml(true)} variant={showYaml ? "default" : "outline"}>YAML Editor</Button>
        <Button onClick={() => setShowYaml(false)} variant={!showYaml ? "default" : "outline"}>Form</Button>
      </div>
      <div className="w-full max-w-2xl">
        {showYaml ? <YamlEditor /> : <DashboardForm />}
      </div>
    </div>
  );
} 