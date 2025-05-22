'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignupForm } from '@/components/signup-form';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, "has_submitted": false }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1500);
      console.log("signed up")
    } else {
      setMessage(data.detail || "Signup failed.");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-[#09090b]">
      <div className="w-full max-w-sm">
        <SignupForm 
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          registerFun={handleSignup}
          error={message}
        />
      </div>
    </div>
  );
}
