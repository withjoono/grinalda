# 대학 입시 전략 앱 📱

React Native + Expo로 개발된 대학 입시 전략 및 점수 계산 모바일 앱입니다.

## 🚀 앱 설치 방법

### 방법 1: Expo Go로 즉시 실행 (가장 빠름)
1. 스마트폰에 [Expo Go](https://expo.dev/client) 앱 설치
2. 개발자 PC에서 다음 명령어 실행:
   ```bash
   npm start
   # 또는
   npx expo start
   ```
3. QR 코드를 스마트폰으로 스캔하여 앱 실행

### 방법 2: 독립 실행형 APK 빌드 (Android)
```bash
# Android APK 빌드
npm run build:android
```

### 방법 3: EAS Build (권장 - 프로덕션용)
```bash
# EAS CLI 설치
npm install -g @expo/cli eas-cli

# Android 빌드
eas build --platform android

# iOS 빌드 (Mac 필요)
eas build --platform ios
```

## 📦 개발 환경 설정

### 필수 요구사항
- Node.js 18+
- Expo CLI
- Android Studio (Android 빌드용)
- Xcode (iOS 빌드용, Mac만)

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start

# Android 에뮬레이터에서 실행
npm run android

# iOS 시뮬레이터에서 실행
npm run ios

# 웹에서 실행
npm run web
```

## 📱 앱 기능

- 📊 성적 입력 및 계산
- 🎯 대학 선택 및 전략 수립
- 📈 입시 결과 분석
- 🔄 지원 전략 관리

## 🏗️ 프로젝트 구조

```
Mock_Application/
├── screens/           # 화면 컴포넌트
├── components/        # 재사용 가능한 UI 컴포넌트
├── lib/              # 유틸리티 및 상수
├── assets/           # 이미지, 아이콘
├── App.tsx           # 메인 앱 컴포넌트
├── app.json          # Expo 설정
└── package.json      # 프로젝트 의존성
```

## 🔧 빌드 설정

앱은 다음과 같이 설정되어 있습니다:
- **앱 이름**: 대학 입시 전략 앱
- **Bundle ID**: com.collegestrategy.app
- **플랫폼**: iOS, Android
- **아이콘**: `/assets/icon.png`

## 📋 배포 체크리스트

- [ ] 앱 아이콘 및 스플래시 화면 준비
- [ ] 앱 스토어/플레이 스토어 개발자 계정 준비
- [ ] 프로덕션 빌드 테스트
- [ ] 앱 설명 및 스크린샷 준비
- [ ] 개인정보처리방침 및 이용약관 준비

## 🆘 문제 해결

### 일반적인 문제
1. **Metro bundler 오류**: `npx expo start --clear` 실행
2. **의존성 문제**: `npm install` 다시 실행
3. **Android 빌드 실패**: Android Studio에서 SDK 업데이트 확인

### 지원
- [Expo 문서](https://docs.expo.dev/)
- [React Native 문서](https://reactnative.dev/)