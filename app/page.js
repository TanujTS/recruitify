"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button"
import Image from "next/image";
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter();
  const handleLoginBtn = () => {
    router.push("/login")
  }

  const handleRegisterBtn = () => {
    router.push("/signup")
  }
  return (
    <div className="bg-[url(/landing-bg.png)] bg-cover bg-no-repeat min-h-[92vh] w-full flex text-white">
      <div className="flex mx-auto my-10">
        <div className="max-h-[60vh] max-w-[40vw] m-2">
          <h1 className="text-7xl">Not Just Any Fit, Find The Right Fit</h1>
          <p className="mt-10 text-2xl w-[70%]">We’re here to help you find the right person for
            your job, whatever it may be.</p>
          <div className="buttons">
            <Button onClick={handleLoginBtn}>Login</Button>
            <Button onClick={handleRegisterBtn}>Register</Button>
          </div>
        </div>
        <div>
          <Image src="/landing-img.png"
            width={600}
            height={600}
            alt="Picture of the author"></Image>
        </div>
      </div>
      <div>
      </div>
    </div>
  )
}