import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, TrendingDown } from 'lucide-react';

export function MatchCircleCard({ score }) {
  const matchPercentage = score ? Math.round(score) : 78;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (matchPercentage / 100) * circumference;

  const getMatchLevel = (percentage) => {
    if (percentage >= 80) return { level: 'Excellent', color: 'text-green-400', icon: TrendingUp };
    if (percentage >= 60) return { level: 'Good', color: 'text-yellow-400', icon: TrendingUp };
    return { level: 'Needs Improvement', color: 'text-red-400', icon: TrendingDown };
  };

  const matchInfo = getMatchLevel(matchPercentage);
  const IconComponent = matchInfo.icon;

  const getCircleColor = (percentage) => {
    if (percentage >= 80) return 'stroke-green-400';
    if (percentage >= 60) return 'stroke-yellow-400';
    return 'stroke-red-400';
  };

  return (
    <Card className="bg-[#121212] border border-[#2a2a2a] text-white shadow-md rounded-xl min-w-[300px]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-[#D86072]" />
          Job Match Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {/* Circular Progress */}
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-700"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`${getCircleColor(matchPercentage)} transition-all duration-1000 ease-in-out`}
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{matchPercentage}%</span>
            </div>
          </div>

          {/* Match level info */}
          <div className="text-center space-y-2">
            <div className={`flex items-center justify-center gap-1 ${matchInfo.color}`}>
              <IconComponent className="h-4 w-4" />
              <span className="font-medium">{matchInfo.level}</span>
            </div>
            
            <p className="text-sm text-gray-400 max-w-48 text-center">
              {score 
                ? 'Match score based on your resume analysis'
                : 'Estimated match for software development positions'
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}