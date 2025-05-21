'use client';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const chartData = [
  { skill: "Frontend", score: 90 },
  { skill: "UX Design", score: 85 },
  { skill: "Backend", score: 70 },
  { skill: "DevOps", score: 65 },
  { skill: "Mobile", score: 75 },
  { skill: "AI/ML", score: 60 },
];

export default function CompatibilityChart() {
  return (
    <Card className="bg-[#121212] border border-[#2a2a2a] text-white shadow-md rounded-xl h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Skill Compatibility</CardTitle>
          <HelpCircle className="h-4 w-4 text-gray-400" />
        </div>
        <p className="text-sm text-gray-400">Your technical expertise distribution</p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="w-full h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart 
              outerRadius="75%" 
              data={chartData}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <PolarGrid 
                gridType="polygon"
                stroke="#2a2a2a" 
                strokeWidth={1}
              />
              <PolarAngleAxis 
                dataKey="skill" 
                tick={{ fill: '#aaa', fontSize: 12 }}
                tickLine={false}
                stroke="#2a2a2a"
              />
              <Radar
                name="Skills"
                dataKey="score"
                stroke="#D86072"
                fill="#D86072"
                fillOpacity={0.6}
                dot={true}
                activeDot={{ r: 5, fill: "#fff", stroke: "#D86072" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 justify-center">
          {chartData.map((item, index) => (
            <div 
              key={index} 
              className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
              style={{ 
                backgroundColor: `rgba(216, 96, 114, ${item.score / 100 * 0.3})`,
                color: item.score > 75 ? '#fff' : '#ccc' 
              }}
            >
              <span 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: `rgba(216, 96, 114, ${item.score / 100})` }}
              ></span>
              {item.skill}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}