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
import { 
  Activity, 
  Briefcase, 
  Code, 
  Star, 
  FileText, 
  TrendingUp, 
  User, 
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingResume, setProcessingResume] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchUserData(token);
  }, [router]);

  const fetchUserData = async (token) => {
    try {
      // Fetch user info
      const userResponse = await fetch('http://localhost:8000/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        router.push('/login');
        return;
      }

      const userData = await userResponse.json();
      setUser(userData);

      if (!userData.has_submitted) {
        router.push('/dashboard/recruit');
        return;
      }

      // Fetch resume analysis if user has submitted
      await fetchResumeAnalysis(token);
      
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchResumeAnalysis = async (token) => {
    try {
      setProcessingResume(true);
      
      const response = await fetch('http://localhost:8000/resume-analysis', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('No resume found. Please upload a resume first.');
          return;
        }
        throw new Error('Failed to process resume');
      }

      const analysisData = await response.json();
      setResumeAnalysis(analysisData);

    } catch (err) {
      console.error('Error processing resume:', err);
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setProcessingResume(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'bg-green-900/20 border-green-700';
    if (score >= 60) return 'bg-yellow-900/20 border-yellow-700';
    return 'bg-red-900/20 border-red-700';
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#D86072] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="text-[#D86072]">{user?.username}</span>
          </h1>
          <p className="text-gray-400">Here's your resume analysis overview</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-[#1e1e1e] rounded-xl border border-[#2a2a2a]">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-300">Resume Status:</span>
          <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 text-sm">
            ✓ Submitted
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="bg-red-500/10 border border-red-500/20 text-white shadow-lg rounded-xl mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Grid */}
      <div className="">
        {/* Score Card */}
        {/* <div className="xl:col-span-1">
          {processingResume ? (
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#121212] border border-[#2a2a2a] text-white shadow-xl rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#D86072]" />
                  Resume Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#D86072] border-t-transparent mx-auto"></div>
                  <p className="mt-4 text-sm text-gray-400">Analyzing your resume...</p>
                </div>
              </CardContent>
            </Card>
          ) : resumeAnalysis ? (
            <MatchCircleCard score={resumeAnalysis?.score} />
          ) : null}
        </div> */}

        {/* Section Analysis Card */}
        <div className="max-w-[60vw] m-auto">
          <SummaryCard resumeData={resumeAnalysis} />
        </div>

        {/* Resume Summary Card */}
        {/* {resumeAnalysis && (
          <div className="xl:col-span-3">
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#121212] border border-[#2a2a2a] text-white shadow-xl rounded-2xl">
              <CardHeader className="pb-4 bg-gradient-to-r from-[#D86072]/10 to-transparent">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#D86072]/20 border border-[#D86072]/30">
                    <FileText className="h-5 w-5 text-[#D86072]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">AI Resume Summary</h3>
                    <p className="text-sm text-gray-400">Comprehensive analysis of your resume</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-[#0f0f0f] rounded-xl p-6 border border-[#2a2a2a]">
                  <p className="text-gray-200 leading-relaxed">
                    {resumeAnalysis.summary || 'No summary available'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )} */}

        {/* Retry Button */}
        {error && (
          <div className="xl:col-span-3 flex justify-center">
            <Button 
              onClick={() => {
                setError('');
                const token = localStorage.getItem('token');
                if (token) fetchResumeAnalysis(token);
              }}
              className="bg-gradient-to-r from-[#D86072] to-[#ff7a8a] hover:from-[#c55365] hover:to-[#e66b7d] text-white px-8 py-3 rounded-xl transition-all duration-200 shadow-lg"
              disabled={processingResume}
            >
              {processingResume ? 'Processing...' : 'Retry Analysis'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}