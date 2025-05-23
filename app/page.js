"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { useRouter } from 'next/navigation'
import ProcessStepsCarousel from "@/components/ProcessStepsCarousel";


export default function Home() {
  const OPTIONS = { loop: true, slidesToScroll: 1 }
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLoginBtn = () => router.push("/login");
  const handleDashboardBtn = () => router.push("/dashboard");
  const handleRegisterBtn = () => router.push("/signup");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);  
      return;
    }

    fetch('http://localhost:8000/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          setLoading(false);  
          return;
        }
        const data = await res.json();
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);  
      });
  }, [router]);

  if (loading) {
    return (
      <div className="text-white bg-[#262628] min-h-[92vh] p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D86072] mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[url(/landing-bg.png)] bg-cover bg-no-repeat min-h-[92vh] w-full flex-col text-white">
      <div className="flex mx-auto pt-12 pl-12 w-full">
        <div className="min-w-[50vw] m-2 flex flex-col">
          <h1 className="heading w-[70%] text-7xl">Not Just Any Fit, Find The Right Fit</h1>
          <p className="mt-8 text-2xl w-[70%]">
            We're here to help you find the right person for your job, whatever it may be.
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
          
          {/* Process Steps Section */}
          <div className="mt-8">
            <div className="mb-4">
              <h2 className="text-4xl font-bold">How It Works</h2>
            </div>
            <ProcessStepsCarousel options={OPTIONS} />
          </div>
        </div>
        
        <div className="hidden justify-end items-start lg:flex">
          <Image
            src="/landing-img.png"
            width={800}
            height={800}
            alt="Landing image"
          />
        </div>
      </div>
    </div>
  );
}