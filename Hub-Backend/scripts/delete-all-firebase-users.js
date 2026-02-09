const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '..', 'firebase-service-account-key.json'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

async function deleteAllUsers() {
    console.log('🔍 Firebase 사용자 목록을 가져오는 중...');

    let totalDeleted = 0;
    let nextPageToken;

    do {
        const listResult = await admin.auth().listUsers(1000, nextPageToken);
        const users = listResult.users;

        if (users.length === 0) {
            break;
        }

        console.log(`📋 ${users.length}명의 사용자 발견:`);
        users.forEach((user) => {
            console.log(`   - ${user.email || user.uid} (${user.providerData.map(p => p.providerId).join(', ')})`);
        });

        const uids = users.map((user) => user.uid);
        const result = await admin.auth().deleteUsers(uids);

        totalDeleted += result.successCount;
        console.log(`✅ ${result.successCount}명 삭제 완료, ${result.failureCount}명 실패`);

        if (result.failureCount > 0) {
            result.errors.forEach((err) => {
                console.error(`   ❌ 실패: ${err.error.message}`);
            });
        }

        nextPageToken = listResult.pageToken;
    } while (nextPageToken);

    console.log(`\n🎉 총 ${totalDeleted}명의 Firebase 사용자가 삭제되었습니다.`);
    process.exit(0);
}

deleteAllUsers().catch((err) => {
    console.error('❌ 에러 발생:', err.message);
    process.exit(1);
});
