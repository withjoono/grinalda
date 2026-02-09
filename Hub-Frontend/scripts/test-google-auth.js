/**
 * Google Auth 디버그 테스트
 * Playwright로 회원가입 페이지를 열고 구글 인증 버튼 클릭 후 콘솔 로그 캡처
 */
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({
        headless: false,  // 브라우저 창 보이게
        args: ['--disable-web-security']  // COOP 비활성화 시도
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    // 콘솔 로그 캡처
    const consoleLogs = [];
    page.on('console', (msg) => {
        const text = `[${msg.type()}] ${msg.text()}`;
        consoleLogs.push(text);
        console.log(text);
    });

    // 페이지 에러 캡처
    page.on('pageerror', (err) => {
        console.log(`[PAGE ERROR] ${err.message}`);
        consoleLogs.push(`[PAGE ERROR] ${err.message}`);
    });

    // dialog (alert) 캡처
    page.on('dialog', async (dialog) => {
        console.log(`\n=== ALERT DIALOG ===`);
        console.log(dialog.message());
        console.log(`=== END ALERT ===\n`);
        await dialog.accept();
    });

    console.log('1. 회원가입 페이지 로딩...');
    await page.goto('http://localhost:3000/auth/register', { waitUntil: 'networkidle' });
    console.log('2. 페이지 로드 완료');

    // 스크린샷 저장
    await page.screenshot({ path: 'scripts/auth-test-1.png', fullPage: true });
    console.log('3. 스크린샷 저장: auth-test-1.png');

    // 구글 인증 버튼 찾기
    const googleButton = await page.locator('button:has-text("구글"), button:has-text("Google"), button:has-text("본인인증")').first();

    if (await googleButton.isVisible()) {
        console.log('4. 구글 인증 버튼 발견! 클릭 중...');

        // 팝업 감지
        const popupPromise = context.waitForEvent('page', { timeout: 15000 }).catch(() => null);

        await googleButton.click();
        console.log('5. 버튼 클릭 완료. 팝업 대기 중...');

        const popup = await popupPromise;

        if (popup) {
            console.log(`6. 팝업 열림! URL: ${popup.url()}`);
            await page.screenshot({ path: 'scripts/auth-test-2-popup.png' });

            // 팝업이 10초 안에 닫히는지 확인
            await popup.waitForEvent('close', { timeout: 10000 }).catch(() => {
                console.log('7. 팝업이 10초 내에 닫히지 않음 (사용자 인증 대기 중)');
            });
        } else {
            console.log('6. 팝업이 열리지 않음! (15초 타임아웃)');
            await page.screenshot({ path: 'scripts/auth-test-2-no-popup.png' });
        }

        // 5초 더 대기 후 최종 상태 캡처
        await page.waitForTimeout(5000);
        await page.screenshot({ path: 'scripts/auth-test-3-final.png' });
        console.log('8. 최종 스크린샷 저장');

    } else {
        console.log('4. 구글 인증 버튼을 찾을 수 없음!');
        // 페이지 내용 출력
        const bodyText = await page.locator('body').innerText();
        console.log('페이지 내용 (첫 500자):', bodyText.substring(0, 500));
    }

    console.log('\n=== 콘솔 에러 로그 ===');
    consoleLogs.filter(l => l.includes('[error]') || l.includes('Error') || l.includes('COOP')).forEach(l => console.log(l));
    console.log('=== END ===');

    // 브라우저 닫기 (30초 후)
    console.log('\n30초 후 브라우저 종료...');
    await page.waitForTimeout(30000);
    await browser.close();
})();
