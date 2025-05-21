
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import CompatibilityChart from '@/components/CompatibilityChart';
import SummaryCard from '@/components/SummaryCard';
import { MatchCircleCard } from '@/components/MatchCircle';
import { Activity, Briefcase, Code, Star } from 'lucide-react';


export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetch('http://localhost:8000/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          router.push('/login');
        } else {
          const data = await res.json();
          setUser(data);
          setLoading(false);
        }
      })
      .catch(() => {
        router.push('/login');
      });
  }, [router]);

  if (loading) {
    return <p className="text-white p-8 text-center">Loading...</p>;
  }

  return (
    <div className="text-white bg-[#262628] min-h-[92vh] p-4">
      <h1 className="text-4xl p-3">Welcome, {user.username}</h1>

      <div className="flex flex-wrap gap-6 justify-evenly">
        <SummaryCard />
        <CompatibilityChart />
        <MatchCircleCard />

        <Card className="bg-[#121212] border border-[#2a2a2a] text-white shadow-md rounded-xl w-[60vw]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[#D86072]" />
              Portfolio Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-200">
              <li>Fintech dashboard UI</li>
              <li>Real-time chat app</li>
              <li>E-commerce checkout redesign</li>
              <li>React + Firebase CMS</li>
              <li>Mobile-first web app</li>
              <li>GSAP portfolio animations</li>
              <li>Open-source design system</li>
              <li>SaaS onboarding revamp</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}