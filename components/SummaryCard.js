import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, CheckCircle, XCircle } from 'lucide-react';

export default function SummaryCard({ resumeData }) {
  const getSectionStatus = (sectionName) => {
    if (!resumeData || !resumeData.sections) return false;
    return Object.keys(resumeData.sections).some(key => 
      key.toLowerCase().includes(sectionName.toLowerCase())
    );
  };

  const sections = [
    { name: 'Experience', key: 'experience' },
    { name: 'Education', key: 'education' },
    { name: 'Skills', key: 'skills' },
    { name: 'Projects', key: 'projects' },
  ];

  return (
    <Card className="bg-[#121212] border border-[#2a2a2a] text-white shadow-md rounded-xl min-w-[300px]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#D86072]" />
          Resume Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sections.map((section) => {
            const hasSection = getSectionStatus(section.key);
            return (
              <div key={section.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{section.name}</span>
                <div className="flex items-center gap-1">
                  {hasSection ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                  <span className={`text-xs ${hasSection ? 'text-green-400' : 'text-red-400'}`}>
                    {hasSection ? 'Found' : 'Missing'}
                  </span>
                </div>
              </div>
            );
          })}
          
          {resumeData && (
            <div className="pt-3 border-t border-[#2a2a2a]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Total Sections</span>
                <span className="text-sm font-medium text-[#D86072]">
                  {Object.keys(resumeData.sections).length}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}