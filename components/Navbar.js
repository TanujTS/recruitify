import React from 'react'
import { Racing_Sans_One } from 'next/font/google'
import Image from 'next/image'
import { LucideHome, LucideUser2 } from 'lucide-react'
import Link from 'next/link'

const racing = Racing_Sans_One({ subsets: ['latin'], weight: '400' })
const Navbar = () => {
  return (
    <div>
      <nav className="bg-[#D86072] h-[8vh]">
        <ul className="navbar flex h-full items-center justify-between mx-4">
          <Link href="/"><li className={`${racing.className} text-4xl text-white flex items-center gap-1`}>Recruitify</li></Link>
          <div className="flex gap-5">
          <Link href="/"><li><LucideHome size={32}/></li></Link>
          <Link href="/dashboard"><li className="flex text-2xl"><LucideUser2 size={32}/>username</li></Link>
          </div>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
