import { useState } from "react";
import api from "../lib/api";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function YamlEditor() {
  const [yaml, setYaml] = useState("");
  const [result, setResult] = useState("");
  const uuid = localStorage.getItem("uuid");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await api.post("/provision/yaml", { uuid, yaml });
      setResult(JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      setResult(err.response?.data?.error || "Provision failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <Textarea rows={10} value={yaml} onChange={e => setYaml(e.target.value)} placeholder="Paste your YAML spec here" />
      <Button onClick={handleSubmit} disabled={loading || !yaml}>
        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
        Provision
      </Button>
      {loading && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin h-5 w-5" /> Provisioning in progress...</div>}
      {result && <pre className="bg-muted p-2 rounded whitespace-pre-wrap">{result}</pre>}
    </div>
  );
} 