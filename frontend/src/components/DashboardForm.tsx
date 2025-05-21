import { useState } from "react";
import api from "../lib/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function DashboardForm() {
  const [bucketName, setBucketName] = useState("");
  const [bucketLocation, setBucketLocation] = useState("");
  const [result, setResult] = useState("");
  const uuid = localStorage.getItem("uuid");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResult("");
    const yaml = `bucket_name: "${bucketName}"
bucket_location: "${bucketLocation}"
`;
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
      <Input placeholder="Bucket Name" value={bucketName} onChange={e => setBucketName(e.target.value)} />
      <Input placeholder="Bucket Location" value={bucketLocation} onChange={e => setBucketLocation(e.target.value)} />
      <Button onClick={handleSubmit} disabled={loading || !bucketName || !bucketLocation}>
        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
        Provision
      </Button>
      {loading && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin h-5 w-5" /> Provisioning in progress...</div>}
      {result && <pre className="bg-muted p-2 rounded whitespace-pre-wrap">{result}</pre>}
    </div>
  );
} 