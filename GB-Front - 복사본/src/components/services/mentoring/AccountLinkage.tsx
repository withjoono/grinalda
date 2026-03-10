import { CodeGenerator } from './CodeGenerator'
import { CodeInput } from './CodeInput'

interface AccountLinkageProps {
  gradeCodeMap?: Record<string, string>
}

const USAGE_INSTRUCTIONS = [
  '멘토가 관리를 원하는 멘티(학생)에게 연계코드를 생성해서 보냅니다.',
  '코드를 받은 멘티(학생)는 거북스쿨에 접속해서, 타 계정 연계란에 받은 코드를 입력합니다.',
  '멘토의 경우, 관리자페이지에, 코드 연계한 멘티들의 계정 리스트가 보여집니다.',
  '계정 연계한 멘티 역시 관리자 페이지에, 본인 계정에 접속 가능한, 멘토 계정리스트가 보여집니다.',
  '멘토는 언제든 멘티계정으로 접속해서, 멘티의 학습계획 성취정도, 수업계획, 모의 성적, 내신 성적 등을 체크하고 관리할 수 있습니다.',
]

export function AccountLinkage({ gradeCodeMap = {} }: AccountLinkageProps) {
  return (
    <div className="mt-10 flex w-full gap-6">
      {/* 왼쪽: 이용 방법 설명 */}
      <div className="flex-1 rounded border border-gray-300 bg-gray-100 p-6 shadow-md">
        <h2 className="mb-5 text-xl font-bold">멘토, 멘티 연결 이용 방법</h2>
        <div className="space-y-2 text-sm leading-6">
          {USAGE_INSTRUCTIONS.map((instruction, index) => (
            <p key={index}>
              {index + 1}. {instruction}
            </p>
          ))}
        </div>
      </div>

      {/* 오른쪽: 코드 생성 및 연계 */}
      <div className="flex flex-1 flex-col gap-5">
        <CodeGenerator />
        <CodeInput gradeCodeMap={gradeCodeMap} />
      </div>
    </div>
  )
}
