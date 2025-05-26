import { useState } from "react";
import api from "../lib/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

export default function DashboardForm() {
  const [selected, setSelected] = useState<{ bucket: boolean; db: boolean }>({ bucket: false, db: false });
  // Bucket fields
  const [bucketName, setBucketName] = useState("");
  const [bucketLocation, setBucketLocation] = useState("");
  // DB fields
  const [dbInstanceName, setDbInstanceName] = useState("");
  const [dbName, setDbName] = useState("");
  const [result, setResult] = useState("");
  const uuid = localStorage.getItem("uuid");
  const [loading, setLoading] = useState(false);

  // Build YAML spec
  const buildYaml = () => {
    const resources: any = {};
    if (selected.bucket) {
      resources.bucket = {
        name: bucketName,
        location: bucketLocation,
      };
    }
    if (selected.db) {
      resources.db = {
        instance_name: dbInstanceName,
        db_name: dbName,
      };
    }
    return `resources:\n${selected.bucket ? `  bucket:\n    name: \"${bucketName}\"\n    location: \"${bucketLocation}\"\n` : ""}${selected.db ? `  db:\n    instance_name: \"${dbInstanceName}\"\n    db_name: \"${dbName}\"\n` : ""}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult("");
    const yaml = buildYaml();
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
      <div className="flex gap-4 items-center">
        <Checkbox id="bucket" checked={selected.bucket} onCheckedChange={v => setSelected(s => ({ ...s, bucket: !!v }))} />
        <label htmlFor="bucket">Bucket</label>
        <Checkbox id="db" checked={selected.db} onCheckedChange={v => setSelected(s => ({ ...s, db: !!v }))} />
        <label htmlFor="db">Database</label>
      </div>
      {selected.bucket && (
        <div className="flex flex-col gap-2 border p-2 rounded">
          <Input placeholder="Bucket Name" value={bucketName} onChange={e => setBucketName(e.target.value)} />
          <Input placeholder="Bucket Location" value={bucketLocation} onChange={e => setBucketLocation(e.target.value)} />
        </div>
      )}
      {selected.db && (
        <div className="flex flex-col gap-2 border p-2 rounded">
          <Input placeholder="DB Instance Name" value={dbInstanceName} onChange={e => setDbInstanceName(e.target.value)} />
          <Input placeholder="DB Name" value={dbName} onChange={e => setDbName(e.target.value)} />
        </div>
      )}
      <div>
        <label className="font-semibold">YAML Preview:</label>
        <pre className="bg-muted p-2 rounded whitespace-pre-wrap text-xs">{buildYaml()}</pre>
      </div>
      <Button onClick={handleSubmit} disabled={loading || (!selected.bucket && !selected.db)}>
        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
        Provision
      </Button>
      {loading && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin h-5 w-5" /> Provisioning in progress...</div>}
      {result && <pre className="bg-muted p-2 rounded whitespace-pre-wrap">{result}</pre>}
    </div>
  );
} 