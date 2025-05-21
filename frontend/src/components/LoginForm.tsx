import { useState } from "react";
import api from "../lib/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [uuid, setUuid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/users/login", { uuid });
      if (res.data.success) {
        localStorage.setItem("uuid", uuid);
        navigate("/dashboard");
      } else {
        setError("Login failed");
      }
    } catch (err: any) {
      setError("Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <Input placeholder="Enter your UUID" value={uuid} onChange={e => setUuid(e.target.value)} />
      <Button onClick={handleLogin} disabled={loading || !uuid}>Login</Button>
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
} 