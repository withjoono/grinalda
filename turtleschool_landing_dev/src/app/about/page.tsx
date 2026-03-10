export default function About() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">학원 소개</h1>
      <div className="space-y-8">
        <section className="bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">원장 인사말</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              안녕하세요. OO학원 원장 OOO입니다.
              22년간의 교육 현장 경험을 바탕으로, 
              학생 한 명 한 명의 잠재력을 최대한 끌어올리는 맞춤형 교육을 제공하고 있습니다.
            </p>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">전문성</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>22년 교육 현장 경험</li>
                <li>학생 맞춤형 교육과정 설계</li>
                <li>교육 컨설팅 전문가</li>
                <li>학습 진단 및 솔루션 제공</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">교육 철학</h2>
          <p className="text-gray-600">
            우리 학원은 학생 개개인의 잠재력을 최대한 끌어올리는 것을 목표로 합니다.
            22년간의 교육 노하우를 바탕으로 각 학생에게 최적화된 학습 방법을 제시합니다.
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

        <section className="bg-blue-50 p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">OO학원만의 특별함</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">맞춤형 교육 설계</h3>
              <p className="text-gray-600">
                22년간의 교육 경험을 바탕으로 학생 개개인에게 최적화된 학습 계획을 수립합니다.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">전문적인 학습 진단</h3>
              <p className="text-gray-600">
                원장 직접 상담을 통한 정확한 학습 수준 진단과 목표 설정을 도와드립니다.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 