import { Loader2 } from "lucide-react"

const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
}

export default Spinner