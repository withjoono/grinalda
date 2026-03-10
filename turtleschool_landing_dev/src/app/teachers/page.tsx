export default function Teachers() {
  const teachers = [
    {
      name: "김철수",
      subject: "수학",
      experience: "교육 경력 10년",
      description: "서울대학교 수학교육과 졸업"
    },
    {
      name: "이영희",
      subject: "영어",
      experience: "교육 경력 8년",
      description: "TESOL 자격증 보유"
    }
  ]

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">강사진 소개</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teachers.map((teacher, index) => (
          <div key={index} className="border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">{teacher.name} 선생님</h2>
            <p className="font-medium mb-2">담당: {teacher.subject}</p>
            <p className="text-gray-600 mb-2">{teacher.experience}</p>
            <p className="text-sm">{teacher.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 