import Config from '@/config';
import { initializeApp } from 'firebase/app';

export const FirebaseApp = initializeApp(Config.firebase);
