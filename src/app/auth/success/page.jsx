"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/oauth-token")
      .then(() => router.push("/dashboard"));
  }, []);

  return <p>Signing you in...</p>;
}
