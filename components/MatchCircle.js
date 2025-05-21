'use client';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Users } from "lucide-react";

export function MatchCircleCard() {
  return (
    <Card className="bg-[#121212] border border-[#2a2a2a] text-white shadow-md rounded-xl">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Job Match</CardTitle>
          <div className="text-xs bg-[#D8607220] text-[#D86072] px-2 py-1 rounded-full">
            New jobs
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-center my-2">
          <MatchCircle percentage={87} />
        </div>
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a] hover:border-[#3a3a3a] cursor-pointer transition-all">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 p-2 rounded-md">
                <Users className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Senior UI Developer</p>
                <p className="text-xs text-gray-400">Fintech platform • Remote</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full px-2 py-1">
                94%
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center justify-between bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a] hover:border-[#3a3a3a] cursor-pointer transition-all">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/10 p-2 rounded-md">
                <Users className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">UX Engineer</p>
                <p className="text-xs text-gray-400">Healthcare • Hybrid</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-green-500/10 text-green-400 text-xs font-medium rounded-full px-2 py-1">
                89%
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MatchCircle({ percentage }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="relative flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          stroke="#2a2a2a"
          strokeWidth="8"
        />
        
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          stroke="#D86072"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 60 60)"
        />
      </svg>
      
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{percentage}%</span>
        <span className="text-xs text-gray-400">Match Rate</span>
      </div>
    </div>
  );
}

export default MatchCircle;