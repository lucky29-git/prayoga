import { useEffect, useState } from "react";
import api from "../lib/api";

export default function SpecExample() {
  const [example, setExample] = useState("");

  useEffect(() => {
    api.get("/provision/spec-example").then(res => setExample(res.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="mb-4 text-xl font-bold">Spec Example</h2>
      <pre className="bg-muted p-2 rounded whitespace-pre-wrap">{example}</pre>
    </div>
  );
} 