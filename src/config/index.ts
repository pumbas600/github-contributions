import { required } from '@/utilities';

export const Config = {
    Github: {
        Token: required(process.env.GITHUB_TOKEN, 'GITHUB_TOKEN'),
    },
    Firebase: {
        ApiKey: required(process.env.FIREBASE_API_KEY, 'FIREBASE_API_KEY'),
        AuthDomain: required(process.env.FIREBASE_AUTH_DOMAIN, 'FIREBASE_AUTH_DOMAIN'),
        DatabaseURL: required(process.env.FIREBASE_DATABASE_URL, 'FIREBASE_DATABASE_URL'),
        ProjectId: required(process.env.FIREBASE_PROJECT_ID, 'FIREBASE_PROJECT_ID'),
        StorageBucket: required(process.env.FIREBASE_STORAGE_BUCKET, 'FIREBASE_STORAGE_BUCKET'),
        MessagingSenderId: required(process.env.FIREBASE_MESSAGING_SENDER_ID, 'FIREBASE_MESSAGING_SENDER_ID'),
        AppId: required(process.env.FIREBASE_APP_ID, 'FIREBASE_APP_ID'),
        MeasurementId: required(process.env.FIREBASE_MEASUREMENT_ID, 'FIREBASE_MEASUREMENT_ID'),
    },
} as const;
