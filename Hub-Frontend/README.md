# GeobukSchool Frontend

React 기반 대학 입시 컨설팅 플랫폼 - NestJS 백엔드 통합

## 프로젝트 개요

**기술 스택**:
- React 18.3.1 + TypeScript 5.5.4
- Vite 5.3.5
- TanStack Router + TanStack Query
- Zustand (상태 관리)
- Tailwind CSS + shadcn/ui

**백엔드 아키텍처**:
- Hub 중앙 인증 서버 (GB-Back-Nest): 포트 4000
- Susi 비즈니스 로직 백엔드: 포트 4001

## 개발 가이드

상세한 개발 가이드는 [CLAUDE.md](./CLAUDE.md)를 참조하세요.

## Todo

- 정시 관심대학 기능
- 정시 모의지원 기능

## 마이그레이션 완료

### ✅ Spring → NestJS 완전 마이그레이션 (2024-12)

모든 기능이 NestJS 백엔드로 마이그레이션되었습니다:
- ✅ 생기부 업로드 기능
- ✅ 사정관 프로필 업로드
- ✅ 논술 관련 기능
- ✅ AWS 파일 업로드

Spring 백엔드는 더 이상 사용하지 않으며, 관련 코드는 모두 주석처리되었습니다.


