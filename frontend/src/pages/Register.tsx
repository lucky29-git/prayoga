import RegisterForm from "../components/RegisterForm";

export default function Register() {
  return (
    <div className="flex flex-col items-center mt-20">
      <h2 className="mb-4 text-xl font-bold">Register</h2>
      <RegisterForm />
    </div>
  );
} 