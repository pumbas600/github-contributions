import Config from '@/config';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(Config.firebase);

export const db = getFirestore(app);
