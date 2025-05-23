import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Target,
  Briefcase,
  BookOpen,
  Lightbulb,
  Folder
} from 'lucide-react';
import { useState } from 'react';

export default function SummaryCard({ resumeData }) {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const getSectionData = (sectionKey) => {
    if (!resumeData || !resumeData.sections) return null;
    
    const matchingKey = Object.keys(resumeData.sections).find(key => 
      key.toLowerCase().includes(sectionKey.toLowerCase()) ||
      sectionKey.toLowerCase().includes(key.toLowerCase())
    );
    
    return matchingKey ? resumeData.sections[matchingKey] : null;
  };

  const sections = [
    { name: 'Professional Experience', key: 'experience', icon: Briefcase, color: 'blue' },
    { name: 'Education', key: 'education', icon: BookOpen, color: 'green' },
    { name: 'Skills', key: 'skills', icon: Lightbulb, color: 'purple' },
    { name: 'Projects', key: 'projects', icon: Folder, color: 'orange' },
  ];

  const foundSections = sections.filter(section => getSectionData(section.key));
  const completionRate = Math.round((foundSections.length / sections.length) * 100);

  const getColorClasses = (color, found = true) => {
    const colors = {
      blue: found ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-blue-600/50 bg-blue-500/5 border-blue-500/10',
      green: found ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-green-600/50 bg-green-500/5 border-green-500/10',
      purple: found ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-purple-600/50 bg-purple-500/5 border-purple-500/10',
      orange: found ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' : 'text-orange-600/50 bg-orange-500/5 border-orange-500/10',
    };
    return colors[color] || colors.blue;
  };

  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#121212] border border-[#2a2a2a] text-white shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="p-4 bg-gradient-to-r from-[#D86072]/10 to-transparent">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#D86072]/20 border border-[#D86072]/30">
              <BarChart3 className="h-5 w-5 text-[#D86072]" />
            </div>
            <div className="">
              <h3 className="text-lg font-semibold">Section Analysis</h3>
              <p className="text-sm text-gray-400">Resume completeness overview</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#D86072]">{completionRate}%</div>
            <div className="text-xs text-gray-400">Complete</div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Completion Progress</span>
            <span className="text-gray-400">{foundSections.length}/{sections.length} sections</span>
          </div>
          <div className="w-full bg-[#2a2a2a] rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#D86072] to-[#ff7a8a] transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-3">
          {sections.map((section) => {
            const sectionData = getSectionData(section.key);
            const hasSection = !!sectionData;
            const isExpanded = expandedSections[section.key];
            const Icon = section.icon;
            
            return (
              <div 
                key={section.name} 
                className={`rounded-xl border transition-all duration-200 ${
                  hasSection 
                    ? 'bg-[#1e1e1e] border-[#3a3a3a] hover:border-[#4a4a4a]' 
                    : 'bg-[#161616] border-[#2a2a2a]'
                }`}
              >
                <div 
                  className={`flex items-center justify-between p-4 ${hasSection ? 'cursor-pointer' : ''}`}
                  onClick={() => hasSection && toggleSection(section.key)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${getColorClasses(section.color, hasSection)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-200">{section.name}</h4>
                      {hasSection && (
                        <p className="text-xs text-gray-400">Click to view summary</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {hasSection ? (
                      <>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          <span className="text-xs text-green-400">Found</span>
                        </div>
                        {isExpanded ? 
                          <ChevronDown className="h-4 w-4 text-gray-400" /> : 
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        }
                      </>
                    ) : (
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                        <XCircle className="h-3 w-3 text-red-400" />
                        <span className="text-xs text-red-400">Missing</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {hasSection && isExpanded && (
                  <div className="px-4 pb-4 border-t border-[#2a2a2a] pt-4 mt-4">
                    <div className="bg-[#0f0f0f] rounded-lg p-3 border border-[#2a2a2a]">
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {sectionData}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Score Display */}
        {resumeData?.score && (
          <div className="pt-4 border-t border-[#2a2a2a]">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#D86072]/10 to-transparent rounded-xl border border-[#D86072]/20">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-[#D86072]" />
                <div>
                  <div className="font-medium text-gray-200">Match Score</div>
                  <div className="text-xs text-gray-400">AI-powered matching</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-[#D86072]">
                {resumeData.score.toFixed(1)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}