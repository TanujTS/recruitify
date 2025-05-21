import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ButtonIcon() {
  return (
    <Button type="submit" className="flex items-center gap-2 justify-self-center hover:cursor-pointer hover:bg-[#2e2d2d75]">
      <span>Submit</span>
      <Send className="h-4 w-4" />
    </Button>
  )
}