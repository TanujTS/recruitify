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
import { Activity, Briefcase, Code, Star, FileText, TrendingUp, User, AlertCircle } from 'lucide-react';

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
      <div className="text-white bg-[#262628] min-h-[92vh] p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D86072] mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white bg-[#262628] min-h-[92vh] p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl p-3">Welcome, {user?.username}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <User className="h-4 w-4" />
          Resume Status: 
          <span className="bg-green-900/20 text-green-400 px-2 py-1 rounded border border-green-700">
            Submitted
          </span>
        </div>
      </div>

      {error && (
        <Card className="bg-red-900/20 border border-red-700 text-white shadow-md rounded-xl mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="h-5 w-5" />
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-6 justify-evenly">
        {/* Resume Analysis Score Card */}
        {processingResume ? (
          <Card className="bg-[#121212] border border-[#2a2a2a] text-white shadow-md rounded-xl min-w-[300px]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#D86072]" />
                Resume Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D86072] mx-auto"></div>
                <p className="mt-2 text-sm text-gray-400">Analyzing your resume...</p>
              </div>
            </CardContent>
          </Card>
        ) : resumeAnalysis ? (
          <MatchCircleCard score={resumeAnalysis?.score} />
        ) : null}

        {/* Existing components */}
        <SummaryCard resumeData={resumeAnalysis} />
        {/* <CompatibilityChart score={resumeAnalysis?.score} /> */}
        

        {/* Resume Summary Card */}
        {resumeAnalysis && (
          <Card className="bg-[#121212] border border-[#2a2a2a] text-white shadow-md rounded-xl w-[60vw]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#D86072]" />
                Resume Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-200 leading-relaxed">
                {resumeAnalysis.summary || 'No summary available'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Retry Analysis Button */}
        {error && (
          <Card className="bg-[#121212] border border-[#2a2a2a] text-white shadow-md rounded-xl">
            <CardContent className="p-6 text-center">
              <Button 
                onClick={() => {
                  setError('');
                  const token = localStorage.getItem('token');
                  if (token) fetchResumeAnalysis(token);
                }}
                className="bg-[#D86072] hover:bg-[#c55365] text-white"
                disabled={processingResume}
              >
                {processingResume ? 'Processing...' : 'Retry Analysis'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}