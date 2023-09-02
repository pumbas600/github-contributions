import { required } from '@/utilities';

const Config = {
    github: {
        token: required(process.env.GITHUB_TOKEN, 'GITHUB_TOKEN'),
    },
    firebase: {
        apiKey: required(process.env.FIREBASE_API_KEY, 'FIREBASE_API_KEY'),
        authDomain: required(process.env.FIREBASE_AUTH_DOMAIN, 'FIREBASE_AUTH_DOMAIN'),
        projectId: required(process.env.FIREBASE_PROJECT_ID, 'FIREBASE_PROJECT_ID'),
        storageBucket: required(process.env.FIREBASE_STORAGE_BUCKET, 'FIREBASE_STORAGE_BUCKET'),
        messagingSenderId: required(process.env.FIREBASE_MESSAGING_SENDER_ID, 'FIREBASE_MESSAGING_SENDER_ID'),
        appId: required(process.env.FIREBASE_APP_ID, 'FIREBASE_APP_ID'),
        masurementId: required(process.env.FIREBASE_MEASUREMENT_ID, 'FIREBASE_MEASUREMENT_ID'),
    },
} as const;

export default Config;
