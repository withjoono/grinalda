
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

// Log current working directory
console.log('Current working directory:', process.cwd());

// Load service account (mimicking FirebaseAdminService)
const serviceAccountPath = path.resolve(__dirname, '../firebase-service-account-key.json');
console.log('Service account path:', serviceAccountPath);

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Service account file not found!');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

// The ID token from the error log
const idToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3NThlNTYzYzBiNjRhNzVmN2UzZGFlNDk0ZDM5NTk1YzE0MGVmOTMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdHMtYmFjay1uZXN0LTQ3OTMwNSIsImF1ZCI6InRzLWJhY2stbmVzdC00NzkzMDUiLCJhdXRoX3RpbWUiOjE3NzAwNzM4NTksInVzZXJfaWQiOiI5RG5wOWRoWnViUUtYaEU2ZUkza0t6dEVxUkQzIiwic3ViIjoiOURucDlkaFp1YlFLWGhFNmVJM2tLenRFcVJEMyIsImlhdCI6MTc3MDA3Mzg1OSwiZXhwIjoxNzcwMDc3NDU5LCJlbWFpbCI6IndpdGhqdW5vNkBuYXZlci5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsid2l0aGp1bm82QG5hdmVyLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.nM_D3GMloKkF6_ZDK_Rh4hkzYPyFK85PaSGSFNpa0SQYwkf5EQbDqwaPzaFnJFvIsxRfQjWdLNqH9VT8ysFRkhb6yBPoLazkvGvp9v_Ckk52r0iOVzv07hKsp5Etaw4-y-EyI72eXyz77nmBaVR6mBM9tUvQ3F8WsiAdybhI-EDOGZsJI9SOvM4OzqyuGYlqjSS_Yn2lm3M_yy_Fe1_CQoYc2-xUweHjGSsGl1qGyxezfCpaSiGRzvEpbe559yN3DdWJlS2nh8wder2MahOxMokOtVpjAAN8ZkeNUuE56dUvQ0sFP7Jt4GszjToUVN1kFq_VHPr2ly4vaxSACT0gSQ';

async function verifyToken() {
  try {
    console.log('Verifying token...');
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('Token verification successful!');
    console.log('Decoded Token:', JSON.stringify(decodedToken, null, 2));
  } catch (error) {
    console.error('Token verification failed!');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
  }
}

verifyToken();
