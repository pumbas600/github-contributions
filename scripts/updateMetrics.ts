import { initializeApp } from 'firebase/app';
import { QueryDocumentSnapshot, collection, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
});

export const db = getFirestore(app);

const githubContributionMetrics = collection(db, 'github_contribution_metrics');

async function updateMetric(snapshot: QueryDocumentSnapshot): Promise<void> {
    const { username } = snapshot.data();

    // Sanity check.
    if (typeof username !== 'string') {
        console.log(`What is going on with the username '${username}'? (id = ${snapshot.id})`);
        return;
    }

    // Check whether the username is already lowercase.
    if (username === username.toLowerCase()) return;

    await updateDoc(snapshot.ref, { username: username.toLowerCase() });
    console.log(`Updated username '${username}' to '${username.toLowerCase()}' (id = ${snapshot.id})`);
}

async function main(): Promise<void> {
    const response = await getDocs(githubContributionMetrics);

    const promises = response.docs.map(updateMetric);
    await Promise.all(promises);

    console.log('✅ Successfully updated all metrics.');
}

main();
