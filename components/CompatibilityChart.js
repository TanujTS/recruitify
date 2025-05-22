import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from 'lucide-react';

export default function CompatibilityChart({ score }) {
  // Generate compatibility data based on resume score
  const getCompatibilityData = () => {
    if (!score) {
      // Default data when no score available
      return [
        { category: 'Technical Skills', percentage: 75 },
        { category: 'Experience', percentage: 68 },
        { category: 'Education', percentage: 82 },
        { category: 'Projects', percentage: 71 },
        { category: 'Communication', percentage: 79 },
      ];
    }

    // Generate data based on actual score with some variation
    const baseScore = score;
    return [
      { category: 'Technical Skills', percentage: Math.min(100, baseScore + (Math.random() * 20 - 10)) },
      { category: 'Experience', percentage: Math.min(100, baseScore + (Math.random() * 20 - 10)) },
      { category: 'Education', percentage: Math.min(100, baseScore + (Math.random() * 20 - 10)) },
      { category: 'Projects', percentage: Math.min(100, baseScore + (Math.random() * 20 - 10)) },
      { category: 'Communication', percentage: Math.min(100, baseScore + (Math.random() * 20 - 10)) },
    ];
  };

  const data = getCompatibilityData();

  const getBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-400';
    if (percentage >= 60) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <Card className="bg-[#121212] border border-[#2a2a2a] text-white shadow-md rounded-xl min-w-[400px]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#D86072]" />
          Skills Compatibility
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">{item.category}</span>
                <span className="text-sm font-medium text-white">
                  {Math.round(item.percentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getBarColor(item.percentage)}`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        {score && (
          <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Based on Resume Score</span>
              <span className="text-sm font-medium text-[#D86072]">
                {score.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}