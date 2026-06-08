import { Suspense } from "react";
import LoginForm from "./LoginForm";

// useSearchParams (inside LoginForm) needs a Suspense boundary.
export default function LoginPage() {
  return (
    <Suspense
      fallback={<main className="min-h-screen bg-navy" />}
    >
      <LoginForm />
    </Suspense>
  );
}
