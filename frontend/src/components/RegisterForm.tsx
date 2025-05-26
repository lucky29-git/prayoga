import { useState } from "react";
import api from "../lib/api";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [uuid, setUuid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/users/register", { name });
      setUuid(res.data.uuid);
      localStorage.setItem("uuid", res.data.uuid);
      localStorage.setItem("username", res.data.username);
      setTimeout(() => navigate("/dashboard"), 500); // short delay to show uuid
    } catch (err: any) {
      setError("Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <Input placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} />
      <Button onClick={handleRegister} disabled={loading || !name}>Register</Button>
      {uuid && <div className="text-green-600">Your UUID: <b>{uuid}</b></div>}
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
} 