import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const SummaryCard = () => {
  return (
    <Card className="bg-[#121212] border border-[#2a2a2a] text-white shadow-md rounded-x p-6 w-[60vw]">
        <CardTitle className="text-4xl">Summary</CardTitle>
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Application Summary</h2>
          <p className="text-sm text-gray-200">
            Aarav Shah is a strong fit for this role with over 3 years of experience in frontend development. He has proven
            skills in React, CSS animations, and responsive UI design, and has previously led the development of a scalable
            dashboard used by 20,000+ users. His technical stack and collaborative background align perfectly with the project
            requirements.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Resume Summary</h2>
          <p className="text-sm text-gray-200">
            Aarav Shah is a skilled Frontend Developer with over 3 years of experience in building responsive and scalable web
            applications. He specializes in React, JavaScript, HTML/CSS, and modern UI frameworks, with a strong eye for design
            and user experience. Aarav has led front-end development for multiple SaaS platforms and collaborated with
            cross-functional teams to deliver high-performance interfaces. He is passionate about clean code, accessibility,
            and staying current with front-end trends.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default SummaryCard