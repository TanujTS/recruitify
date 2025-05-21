import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { ButtonIcon } from "@/components/ButtonIcon"

const page = () => {
    return (
        <div>
            <div className="bg-[url(/bg-recruit.png)] bg-cover bg-no-repeat min-h-[92vh] w-full flex">
                <div className="card flex-col bg-[#0f0f10c6] text-[#FFF6EE] max-w-[80vw] mx-auto my-auto p-10 rounded-2xl shadow-md shadow-white">
                    <h1 className="text-5xl justify-self-center my-5 font-bold">Tell Us What You Need</h1>
                    <p className="text-xl">Type in what you're looking for — a job title, required skills, years, and anything else that matters!</p>
                    <Textarea
                        className="min-h-[10vh] max-w-[40vw] justify-self-center m-2"
                        placeholder='e.g. “Looking for a frontend developer with 2-4 years of experience in React, UI design, and good communication skills. Must be available full-time and work remotely.”'
                    />
                    <ButtonIcon/>
                </div>
            </div>
        </div>
    )
}
export default page
