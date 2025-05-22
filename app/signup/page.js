"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    const res = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, "has_submitted": false }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => router.push("/"), 1500);
    } else {
      setMessage(data.detail || "Signup failed.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Signup</h1>
      <input required
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input required
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Signup</button>
      <p>{message}</p>
    </div>
  );
}
