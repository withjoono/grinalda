import Navigation from "../../components/navigation"
import MobileNavigation from "../../components/MobileNavigation"
import Footer from "../../components/Footer"
import ParticleBackground from "../../components/ParticleBackground"
import AIITServiceContent from "../../components/AIITServiceContent"

export default function AIITServicePage() {
  return (
    <div className="min-h-screen bg-[#050816]">
      <ParticleBackground />
      <Navigation theme="dark" />
      <MobileNavigation theme="dark" />
      <AIITServiceContent />
      <Footer theme="dark" />
    </div>
  )
}
