import { useMemo, useCallback, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Plus, UserCircle, Trash2, UserPlus, FolderPlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Student {
  id: number
  name: string
  school: string
  class: string
}

interface Child {
  id: number
  name: string
  school: string
  grade?: string
}

interface ChildForDelete {
  id: number
  name: string
}

interface ManagementProps {
  relationCode?: string
  students?: Student[]
  children?: Child[]
  classes?: string[]
  onAddStudent?: (studentCode: string, className: string) => Promise<void>
  onAddClass?: (className: string) => Promise<void>
  onDeleteClass?: (className: string) => Promise<void>
  onDeleteStudent?: (studentId: number) => Promise<void>
  onDeleteChild?: (childId: number) => Promise<void>
}

type UserType = 'student' | 'parent' | 'teacher' | null

const selectRelationType = (code?: string): UserType => {
  switch (code) {
    case '10':
    case '30':
      return 'student'
    case '20':
      return 'parent'
    case '40':
    case '50':
    case '70':
      return 'teacher'
    default:
      return null
  }
}

export function Management({
  relationCode,
  students = [],
  children = [],
  classes = ['A반', 'B반', 'C반', 'D반'],
  onAddStudent,
  onAddClass,
  onDeleteClass,
  onDeleteStudent,
  onDeleteChild,
}: ManagementProps) {
  const type = selectRelationType(relationCode)
  const [selectedClass, setSelectedClass] = useState(classes[0] || '')

  // Dialog 상태
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [isAddClassOpen, setIsAddClassOpen] = useState(false)
  const [isDeleteClassOpen, setIsDeleteClassOpen] = useState(false)
  const [isDeleteStudentOpen, setIsDeleteStudentOpen] = useState(false)

  // 폼 상태
  const [newStudentCode, setNewStudentCode] = useState('')
  const [newClassName, setNewClassName] = useState('')
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)
  const [childToDelete, setChildToDelete] = useState<ChildForDelete | null>(null)
  const [isDeleteChildOpen, setIsDeleteChildOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleClassChange = useCallback((value: string) => {
    setSelectedClass(value)
  }, [])

  // 학생 추가 핸들러
  const handleAddStudent = async () => {
    if (!newStudentCode.trim()) {
      toast.error('학생 코드를 입력해주세요.')
      return
    }
    if (!onAddStudent) {
      toast.error('학생 추가 기능이 설정되지 않았습니다.')
      return
    }
    setIsLoading(true)
    try {
      await onAddStudent(newStudentCode.trim(), selectedClass)
      toast.success('학생이 추가되었습니다.')
      setNewStudentCode('')
      setIsAddStudentOpen(false)
    } catch {
      toast.error('학생 추가에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 반 추가 핸들러
  const handleAddClass = async () => {
    if (!newClassName.trim()) {
      toast.error('반 이름을 입력해주세요.')
      return
    }
    if (!onAddClass) {
      toast.error('반 추가 기능이 설정되지 않았습니다.')
      return
    }
    setIsLoading(true)
    try {
      await onAddClass(newClassName.trim())
      toast.success('반이 추가되었습니다.')
      setNewClassName('')
      setIsAddClassOpen(false)
    } catch {
      toast.error('반 추가에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 반 삭제 핸들러
  const handleDeleteClass = async () => {
    if (!selectedClass) {
      toast.error('삭제할 반을 선택해주세요.')
      return
    }
    if (!onDeleteClass) {
      toast.error('반 삭제 기능이 설정되지 않았습니다.')
      return
    }
    setIsLoading(true)
    try {
      await onDeleteClass(selectedClass)
      toast.success('반이 삭제되었습니다.')
      setIsDeleteClassOpen(false)
      // 삭제 후 첫 번째 반 선택
      if (classes.length > 1) {
        const remainingClasses = classes.filter(c => c !== selectedClass)
        setSelectedClass(remainingClasses[0] || '')
      }
    } catch {
      toast.error('반 삭제에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 학생 삭제 핸들러
  const handleDeleteStudent = async () => {
    if (!studentToDelete) {
      toast.error('삭제할 학생을 선택해주세요.')
      return
    }
    if (!onDeleteStudent) {
      toast.error('학생 삭제 기능이 설정되지 않았습니다.')
      return
    }
    setIsLoading(true)
    try {
      await onDeleteStudent(studentToDelete.id)
      toast.success('학생이 삭제되었습니다.')
      setStudentToDelete(null)
      setIsDeleteStudentOpen(false)
    } catch {
      toast.error('학생 삭제에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 학생 삭제 다이얼로그 열기
  const openDeleteStudentDialog = (student: Student) => {
    setStudentToDelete(student)
    setIsDeleteStudentOpen(true)
  }

  // 자녀 삭제 핸들러 (학부모용)
  const handleDeleteChild = async () => {
    if (!childToDelete) {
      toast.error('삭제할 자녀를 선택해주세요.')
      return
    }
    if (!onDeleteChild) {
      toast.error('자녀 삭제 기능이 설정되지 않았습니다.')
      return
    }
    setIsLoading(true)
    try {
      await onDeleteChild(childToDelete.id)
      toast.success('자녀 연동이 해제되었습니다.')
      setChildToDelete(null)
      setIsDeleteChildOpen(false)
    } catch {
      toast.error('자녀 연동 해제에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 자녀 삭제 다이얼로그 열기
  const openDeleteChildDialog = (child: ChildForDelete) => {
    setChildToDelete(child)
    setIsDeleteChildOpen(true)
  }

  // 선생님: 반별로 필터링된 학생 목록
  const filteredStudents = useMemo(
    () => students.filter((s) => selectedClass === s.class),
    [selectedClass, students]
  )

  if (!type) {
    return (
      <div className="flex-1 p-5">
        <p className="text-gray-500">권한이 없습니다.</p>
      </div>
    )
  }

  // 학부모 UI
  if (type === 'parent') {
    return (
      <div className="flex-1 p-5">
        {/* 자녀 목록 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">내 자녀 목록</h2>
          <Link
            to="/account-linkage"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            자녀 추가하기
          </Link>
        </div>

        {/* 자녀 목록 */}
        {children.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {children.map((child, index) => (
              <div
                key={child.id}
                className="relative p-6 rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all"
              >
                {/* 삭제 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    openDeleteChildDialog({ id: child.id, name: child.name })
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="자녀 연동 해제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link
                  to="/family/$id"
                  params={{ id: String(child.id) }}
                  search={{ name: child.name, school: child.school }}
                  className="block"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100">
                      <UserCircle className="w-8 h-8 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                          자녀{index + 1}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold">{child.name}</h3>
                      <p className="text-sm text-gray-500">{child.school}</p>
                      {child.grade && (
                        <p className="text-xs text-gray-400 mt-1">{child.grade}</p>
                      )}
                    </div>
                    <span className="text-orange-500 text-sm font-medium">
                      관리 &gt;
                    </span>
                  </div>
                </Link>
              </div>
            ))}

            {/* 자녀 추가하기 카드 */}
            <Link
              to="/account-linkage"
              className="flex items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all min-h-[120px]"
            >
              <div className="text-center">
                <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <span className="text-sm text-gray-500">자녀 추가하기</span>
              </div>
            </Link>
          </div>
        ) : (
          <div className="py-16 text-center">
            <UserCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">연동된 자녀가 없습니다.</p>
            <Link
              to="/account-linkage"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              자녀 계정 연동하기
            </Link>
          </div>
        )}

        {/* 자녀 삭제 확인 Dialog */}
        <Dialog open={isDeleteChildOpen} onOpenChange={setIsDeleteChildOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>자녀 연동 해제</DialogTitle>
              <DialogDescription>
                정말 "{childToDelete?.name}"과(와)의 연동을 해제하시겠습니까?
                연동 해제 후에도 다시 연동할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteChildOpen(false)}>
                취소
              </Button>
              <Button variant="destructive" onClick={handleDeleteChild} disabled={isLoading}>
                {isLoading ? '해제 중...' : '연동 해제'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // 선생님 UI
  return (
    <div className="flex-1 p-5">
      {/* 반 선택 및 관리 버튼 */}
      <div className="flex items-center gap-4 mb-8 pb-5">
        <div className="flex gap-2 overflow-x-auto">
          {classes.map((cls) => (
            <button
              key={cls}
              onClick={() => handleClassChange(cls)}
              className={`px-8 py-2 rounded-full font-bold text-lg text-white transition-colors ${
                cls === selectedClass
                  ? 'bg-blue-600'
                  : 'bg-gray-400 hover:bg-blue-600'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
        {/* 반 관리 버튼 */}
        <div className="flex gap-2 ml-2">
          <button
            onClick={() => setIsAddClassOpen(true)}
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            title="반 추가하기"
          >
            <FolderPlus className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsDeleteClassOpen(true)}
            disabled={classes.length === 0}
            className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="기존반 삭제하기"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 학생 테이블 헤더 */}
      <div className="flex items-center justify-between border-b-2 border-gray-300 p-5">
        <div className="flex items-center flex-1">
          <div className="flex-[0.3] text-sm">
            <span className="font-bold ml-2">이름</span>
          </div>
          <div className="flex-[0.7] text-sm">
            <span className="font-bold ml-2">학교</span>
          </div>
        </div>
        {/* 학생 관리 버튼 */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setIsAddStudentOpen(true)}
          >
            <UserPlus className="w-4 h-4" />
            학생 추가
          </Button>
        </div>
      </div>

      {/* 학생 목록 */}
      {filteredStudents.length > 0 ? (
        <>
          {filteredStudents.map((student) => (
            <div key={student.id} className="py-2 border-b border-gray-300">
              <div className="flex items-center h-16 px-5 hover:bg-orange-50 hover:outline hover:outline-1 hover:outline-orange-400 rounded-lg">
                <div className="flex-[0.3] text-base">
                  {student.name}
                </div>
                <div className="flex-[0.7] flex justify-between items-center text-base">
                  <span>{student.school}</span>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/mentor/$id"
                      params={{ id: String(student.id) }}
                      search={{ name: student.name, school: student.school }}
                      className="px-6 py-1 rounded-full bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors"
                    >
                      학생 관리하기
                    </Link>
                    <button
                      onClick={() => openDeleteStudentDialog(student)}
                      className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="학생 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* 학생 추가하기 링크 */}
          <div className="py-6 text-center">
            <Link
              to="/account-linkage"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              학생 계정 연동하기
            </Link>
          </div>
        </>
      ) : (
        <div className="py-16 text-center">
          <UserCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 mb-4">연동된 학생이 없습니다.</p>
          <Link
            to="/account-linkage"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            학생 계정 연동하기
          </Link>
        </div>
      )}

      {/* 학생 추가 Dialog */}
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>학생 추가하기</DialogTitle>
            <DialogDescription>
              추가할 학생의 코드를 입력해주세요. 현재 선택된 반({selectedClass})에 추가됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="studentCode">학생 코드</Label>
              <Input
                id="studentCode"
                placeholder="학생 코드를 입력하세요"
                value={newStudentCode}
                onChange={(e) => setNewStudentCode(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddStudent} disabled={isLoading}>
              {isLoading ? '추가 중...' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 반 추가 Dialog */}
      <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>반 추가하기</DialogTitle>
            <DialogDescription>
              새로 추가할 반의 이름을 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="className">반 이름</Label>
              <Input
                id="className"
                placeholder="예: E반"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddClassOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddClass} disabled={isLoading}>
              {isLoading ? '추가 중...' : '추가'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 반 삭제 확인 Dialog */}
      <Dialog open={isDeleteClassOpen} onOpenChange={setIsDeleteClassOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>반 삭제하기</DialogTitle>
            <DialogDescription>
              정말 "{selectedClass}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteClassOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteClass} disabled={isLoading}>
              {isLoading ? '삭제 중...' : '삭제'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 학생 삭제 확인 Dialog */}
      <Dialog open={isDeleteStudentOpen} onOpenChange={setIsDeleteStudentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>학생 삭제하기</DialogTitle>
            <DialogDescription>
              정말 "{studentToDelete?.name}"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteStudentOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteStudent} disabled={isLoading}>
              {isLoading ? '삭제 중...' : '삭제'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
