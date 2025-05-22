'use client';

import { useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { ButtonIcon } from "@/components/ButtonIcon";
import { useRouter } from 'next/navigation';

export default function Page() {
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const textRef = useRef()

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('User not logged in');
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/submit-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          response,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || 'Submission failed');
        return;
      }
      router.push('/dashboard/upload'); 
      textRef.value=""
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong');
    }
  };

  return (
    <div className="bg-[url(/bg-recruit.png)] bg-cover bg-no-repeat min-h-[92vh] w-full flex">
      <div className="card flex-col bg-[#0f0f10c6] text-[#FFF6EE] max-w-[80vw] mx-auto my-auto p-10 rounded-2xl shadow-md shadow-white">
        <h1 className="text-5xl my-5 font-bold">Tell Us What You Need</h1>
        <p className="text-xl mb-2">Type in what you're looking for...</p>
        <Textarea
          className="min-h-[10vh] max-w-[40vw] m-2"
          ref={textRef}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder='e.g. “Looking for a frontend developer...”'
        />
        <div onClick={handleSubmit}>
        <ButtonIcon  />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
