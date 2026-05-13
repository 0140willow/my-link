# 프로젝트 마이링크 (My Link) PRD

## 1. 프로젝트 개요
- **프로젝트명**: 마이링크 (My Link)
- **목적**: 개발자와 크리에이터가 자신의 링크를 쉽고 빠르게 통합 관리할 수 있는 미니멀한 서비스.
- **대상 사용자**: 
  - 깃허브, 블로그, 포트폴리오를 한 곳에 모으고 싶은 개발자
  - 활동 채널이 다양한 크리에이터

---

## 2. 핵심 기능 목록

### 2.1 필수 기능 (Must-have)
1. **사용자 인증 (Firebase Google Auth)**
   - 구글 계정 전용 로그인 및 가입
2. **프로필 관리 (인라인 편집)**
   - **닉네임 및 프로필 정보 수정**: 페이지 내에서 직접 클릭하여 수정 가능한 인라인 편집 방식 적용
   - 사용자 고유 URL 설정
   - *프로필 이미지는 사용하지 않음*
3. **링크 관리 (CRUD & 인라인 편집)**
   - **인라인 수정**: 링크의 제목과 URL을 목록에서 즉시 수정 가능
   - **자동 아이콘**: Google Favicon API를 사용하여 URL 기반 파비콘 자동 표시
   - 링크 생성, 조회, 삭제
4. **공공 프로필 페이지**
   - 방문자 전용 페이지 (`shadcn/ui` 기반의 미니멀 디자인)

### 2.2 향후 추가 예정 기능
1. **방문자 통계 (Analytics)**: 링크별 클릭 조회수(Click Count) 추적

---

## 3. 기능 상세 설명 및 기술 요구사항

### 3.1 사용자 인증 및 데이터 모델
- **Firebase Auth**: 구글 소셜 로그인 연동.
- **Firestore DB 구조**:
  - `users` 컬렉션: 
    - `uid` (인증 키)
    - `email` (전체 이메일)
    - `displayName` (URL Slug 역할: 구글 이메일 아이디 앞부분으로 자동 초기화)
    - `userName` (사용자가 표시할 실제 이름)
    - `bio` (소개글)
  - `links` 서브 컬렉션: 각 사용자(`users/{uid}`) 하위에 `links` 컬렉션을 생성하여 관리.

### 3.2 UI/UX 디자인 가이드
- **인라인 편집 (Inline Editing)**: 
  - 별도의 모달이나 페이지 전환 없이, 해당 텍스트 클릭 시 입력 폼으로 전환되는 방식.
  - UX의 간결함과 속도 강조.
- **파비콘 연동**: 
  - `https://www.google.com/s2/favicons?domain={domain}&sz=64` API 활용.
- **shadcn/ui**: 일관된 컴포넌트 사용 (Input, Button, Card 등).

---

## 4. 기술 스택
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend/Database**: Firebase (Firestore, Auth)
