const admin = require('firebase-admin');
const https = require('https');
const path = require('path');

const serviceAccount = require(path.resolve(__dirname, '../firebase-service-account-key.json'));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const API_BASE = 'ts-back-nest-479305.du.r.appspot.com';

function httpsPost(hostname, urlPath, body) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(body);
        const req = https.request({
            hostname, path: urlPath, method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(postData) },
        }, (res) => {
            let data = '';
            res.on('data', (c) => data += c);
            res.on('end', () => { try { resolve(JSON.parse(data)); } catch { resolve(data); } });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

function apiCall(method, urlPath, token) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: API_BASE, path: urlPath, method,
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        }, (res) => {
            let data = '';
            res.on('data', (c) => data += c);
            res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(data) }); } catch { resolve({ status: res.statusCode, body: data }); } });
        });
        req.on('error', reject);
        req.end();
    });
}

async function main() {
    try {
        const user = await admin.auth().getUserByEmail('withjoono9@gmail.com');
        const customToken = await admin.auth().createCustomToken(user.uid);
        const apiKey = 'AIzaSyBLLpafoaIWncIXrQL-TYzQdNNXwtyz6Sw';
        const tokenRes = await httpsPost('identitytoolkit.googleapis.com',
            `/v1/accounts:signInWithCustomToken?key=${apiKey}`,
            { token: customToken, returnSecureToken: true });
        const loginRes = await httpsPost(API_BASE, '/auth/firebase/login', { idToken: tokenRes.idToken });
        const at = loginRes.data?.accessToken || loginRes.accessToken;
        const payload = JSON.parse(Buffer.from(at.split('.')[1], 'base64').toString());
        const memberId = payload.jti;

        const rec = await apiCall('GET', `/schoolrecord/${memberId}`, at);
        const d = rec.body.data;

        console.log('SL=' + (d?.subjectLearnings?.length || 0));
        console.log('SS=' + (d?.selectSubjects?.length || 0));
        console.log('CA=' + (d?.creativeActivities?.length || 0));
        console.log('BO=' + (d?.behaviorOpinions?.length || 0));

        // Check 2학기 세특
        const sl = d?.subjectLearnings || [];
        const s2 = sl.filter(s => s.semester === '2');
        const s2setuk = s2.filter(s => s.detailAndSpecialty && s.detailAndSpecialty !== '');
        console.log('2학기_total=' + s2.length + ' 2학기_setuk=' + s2setuk.length);

        // Show creative activities
        if (d?.creativeActivities?.length > 0) {
            console.log('\n--- 창체 ---');
            d.creativeActivities.forEach(ca => {
                console.log(ca.grade + ' ' + ca.activityType + ': ' + (ca.content || '').substring(0, 60));
            });
        }

        // Show behavior opinions  
        if (d?.behaviorOpinions?.length > 0) {
            console.log('\n--- 행특 ---');
            d.behaviorOpinions.forEach(bo => {
                console.log(bo.grade + ': ' + (bo.content || '').substring(0, 80));
            });
        }

    } catch (e) {
        console.error('ERR: ' + e.message);
    } finally {
        admin.app().delete();
    }
}
main();
