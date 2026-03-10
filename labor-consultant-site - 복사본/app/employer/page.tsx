import EmployerContent from "../components/EmployerContent"
import Navigation from "../components/navigation"
import MobileNavigation from "../components/MobileNavigation"

export default function EmployerPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation theme="dark" />
      <MobileNavigation theme="dark" />
      <EmployerContent />
    </div>
  )
}
