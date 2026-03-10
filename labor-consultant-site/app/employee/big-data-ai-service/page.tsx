import Navigation from "../../components/navigation"
import MobileNavigation from "../../components/MobileNavigation"
import Footer from "../../components/Footer"
import { WavePattern } from "../../components/WavePattern"
import BigDataAIServiceContent from "../../components/BigDataAIServiceContent"

export default function BigDataAIServicePage() {
  return (
    <div className="min-h-screen bg-white relative">
      {/* 물결 패턴 배경 */}
      <WavePattern theme="light" />

      <Navigation theme="light" />
      <MobileNavigation theme="light" />
      <BigDataAIServiceContent />
      <Footer theme="light" />
    </div>
  )
}
