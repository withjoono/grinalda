export default function About() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">학원 소개</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">교육 철학</h2>
          <p className="text-gray-600">
            우리 학원은 학생 개개인의 잠재력을 최대한 끌어올리는 것을 목표로 합니다.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">시설 안내</h2>
          <p className="text-gray-600">
            최신식 교육 시설과 쾌적한 학습 환경을 제공합니다.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">위치</h2>
          <p className="text-gray-600">
            접근성이 좋은 위치에 자리잡고 있습니다.
          </p>
        </section>
      </div>
    </div>
  )
} 