// Google Auth 테스트 - CommonJS 형식
const { chromium } = require('playwright');

async function test() {
    console.log('브라우저 시작...');
    const browser = await chromium.launch({
        headless: false,
        args: ['--disable-web-security', '--disable-features=CrossOriginOpenerPolicy']
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    const logs = [];
    page.on('console', msg => {
        const t = `[${msg.type()}] ${msg.text()}`;
        logs.push(t);
        console.log(t);
    });
    page.on('pageerror', err => {
        console.log('[PAGE-ERROR]', err.message);
        logs.push('[PAGE-ERROR] ' + err.message);
    });
    page.on('dialog', async dialog => {
        console.log('\n=== ALERT ===');
        console.log(dialog.message());
        console.log('=== /ALERT ===\n');
        await dialog.accept();
    });

    console.log('페이지 로딩...');
    await page.goto('http://localhost:3000/auth/register', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('페이지 로드 완료. URL:', page.url());

    // 구글 버튼 찾기
    const btns = await page.locator('button').all();
    console.log(`총 ${btns.length}개 버튼 발견`);
    for (let i = 0; i < btns.length; i++) {
        const txt = await btns[i].innerText().catch(() => '');
        if (txt) console.log(`  버튼[${i}]: "${txt}"`);
    }

    // "구글" 또는 "Google" 포함 버튼 찾기
    let googleBtn = page.locator('button:has-text("구글")').first();
    if (!(await googleBtn.isVisible().catch(() => false))) {
        googleBtn = page.locator('button:has-text("Google")').first();
    }
    if (!(await googleBtn.isVisible().catch(() => false))) {
        googleBtn = page.locator('button:has-text("본인인증")').first();
    }

    if (await googleBtn.isVisible().catch(() => false)) {
        console.log('\n구글 인증 버튼 발견! 클릭합니다...');

        const popupPromise = context.waitForEvent('page', { timeout: 10000 }).catch(() => null);
        await googleBtn.click();
        console.log('버튼 클릭 완료. 팝업 대기...');

        const popup = await popupPromise;
        if (popup) {
            console.log('✅ 팝업 열림! URL:', popup.url());
            // 팝업이 열렸다면 signInWithPopup 자체는 동작함
            // 팝업을 바로 닫아서 에러 확인
            await page.waitForTimeout(3000);
            await popup.close();
            console.log('팝업 닫힘. 에러 확인 대기...');
            await page.waitForTimeout(3000);
        } else {
            console.log('❌ 팝업이 열리지 않음 (10초 타임아웃)');
            await page.waitForTimeout(3000);
        }
    } else {
        console.log('구글 버튼을 찾을 수 없음');
        const content = await page.content();
        console.log('HTML 일부:', content.substring(0, 1000));
    }

    console.log('\n=== 에러 로그 ===');
    logs.filter(l => l.includes('[error]') || l.includes('Error') || l.includes('COOP') || l.includes('cross-origin'))
        .forEach(l => console.log(l));
    console.log('=== /에러 로그 ===');

    await page.waitForTimeout(5000);
    await browser.close();
    console.log('테스트 완료');
}

test().catch(e => { console.error('스크립트 에러:', e.message); process.exit(1); });
