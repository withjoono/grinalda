import EmployeeContent from "../components/EmployeeContent"
import Navigation from "../components/navigation"
import MobileNavigation from "../components/MobileNavigation"

export default function EmployeePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation theme="light" />
      <MobileNavigation theme="light" />
      <EmployeeContent />
    </div>
  )
}
