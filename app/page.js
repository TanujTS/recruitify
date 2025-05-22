"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { useRouter } from 'next/navigation'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLoginBtn = () => router.push("/login");
  const handleDashboardBtn = () => router.push("/dashboard");
  const handleRegisterBtn = () => router.push("/signup");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);  // ✅ Important
      return;
    }

    fetch('http://localhost:8000/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(async (res) => { 
      if (!res.ok) {
        setLoading(false);  // ✅ Important
        return;
      }
      const data = await res.json();
      setUser(data);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);  // ✅ Also handle error case
    });
  }, [router]);

  if (loading) {
    return <p className="text-white p-8 text-center">Loading...</p>;
  }

  return (
    <div className="bg-[url(/landing-bg.png)] bg-cover bg-no-repeat min-h-[92vh] w-full flex text-white">
      <div className="flex mx-auto my-10">
        <div className="max-h-[60vh] max-w-[40vw] m-2">
          <h1 className="heading text-7xl">Not Just Any Fit, Find The Right Fit</h1>
          <p className="mt-10 text-2xl w-[70%]">
            We’re here to help you find the right person for your job, whatever it may be.
          </p>
          <div className="buttons mt-6 flex gap-4">
            {!user ? (
              <>
                <Button size="lg icon" onClick={handleLoginBtn}>Login</Button>
                <Button size="lg icon" onClick={handleRegisterBtn}>Register</Button>
              </>
            ) : (
              <Button size="lg icon" onClick={handleDashboardBtn}>Dashboard</Button>
            )}
          </div>
        </div>
        <div>
          <Image
            src="/landing-img.png"
            width={600}
            height={600}
            alt="Landing image"
          />
        </div>
      </div>
    </div>
  );
}
