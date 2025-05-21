import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center gap-4 mt-20">
      <Button onClick={() => navigate("/register")}>Register</Button>
      <Button onClick={() => navigate("/login")}>Login</Button>
    </div>
  );
} 