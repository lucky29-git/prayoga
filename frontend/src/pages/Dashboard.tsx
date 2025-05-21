import YamlEditor from "../components/YamlEditor";
import DashboardForm from "../components/DashboardForm";
import { Button } from "../components/ui/button";
import { useState } from "react";

export default function Dashboard() {
  const [showYaml, setShowYaml] = useState(true);

  return (
    <div className="flex flex-col gap-6 mt-8 items-center">
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