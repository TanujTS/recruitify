"use client"
import React, { useEffect, useState } from 'react'
import { Racing_Sans_One } from 'next/font/google'
import { LucideHome, LucideLogOut, LucideUser2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const racing = Racing_Sans_One({ subsets: ['latin'], weight: '400' })

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null); // clear state
    router.push("/"); // optional redirect
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:8000/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(async (res) => {
      if (!res.ok) return;
      const data = await res.json();
      setUser(data);
    })
    .catch((err) => {
      console.error("Failed to fetch user:", err);
    });
  }, []);
  

  return (
    <nav className="bg-[#D86072] h-[8vh]">
      <ul className="navbar flex h-full items-center justify-between mx-4">
        <Link href="/">
          <li className={`${racing.className} text-4xl text-white flex items-center gap-1`}>
            Recruitify
          </li>
        </Link>
        <div className="flex gap-5 items-center">
          <Link href="/"><li><LucideHome size={32} /></li></Link>

          {user ? (
            <>
              <Link href="/dashboard">
                <li className="flex items-center gap-2 text-xl">
                  <LucideUser2 size={28} />
                  {user.username}
                </li>
              </Link>
              <li className="flex items-center gap-2 text-xl cursor-pointer" onClick={handleLogout}>
                <LucideLogOut size={28} />
              </li>
            </>
          ) : (
            <Link href="/login">
              <li className="flex items-center gap-2 text-xl">
                <LucideUser2 size={28} />
              </li>
            </Link>
          )}
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;
