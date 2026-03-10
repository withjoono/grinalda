export default function Courses() {
  const courses = [
    {
      title: "수학 특강",
      description: "수학적 사고력 향상을 위한 체계적인 커리큘럼",
      level: "중등 ~ 고등",
      duration: "12주 과정"
    },
    {
      title: "영어 회화",
      description: "원어민 강사와 함께하는 실용적인 영어 회화",
      level: "초급 ~ 고급",
      duration: "16주 과정"
    },
    // 추가 과정들...
  ]

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">수업 안내</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, index) => (
          <div key={index} className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">{course.title}</h2>
            <p className="text-gray-600 mb-2">{course.description}</p>
            <p className="text-sm">대상: {course.level}</p>
            <p className="text-sm">기간: {course.duration}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 