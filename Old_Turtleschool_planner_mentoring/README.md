NextJS/React/PostgreSQL 기반 거북스쿨 앱

## 파일 구조

pages: 실제로 들어가볼 수 있는 페이지들

	-api: nextjs에서 제공하는 서버사이드 api
	-desktop: 데스크탑에서 볼때 나오는 페이지를 다 모아둔것(컴포넌트 형식으로)
	-early:수시 페이지들
	-gpa: 내신
	-regular: 정시(현재 사용 안함)
	-mockup:모의
	-main: 로그인, 회원정보
	-manager: 연동/관리자 페이지
	-myclass: 마이클래스 유료
	-myclass_free: 마이클래스 무료
	-setting: 설정
	기타 pages 바로 밑에 속한 페이지들

styles: 글로벌 CSS globals.css

public: 웹사이트에서 링크로 액세스할수있는 그림, 동영상, 로고, etc

lib: postgresql 서버에 연결하는 라이브러리 (pool)

contexts: 로그인 컨텍스트

comp: 컴포넌트



```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
