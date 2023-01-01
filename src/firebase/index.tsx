import { initializeApp } from "firebase/app";
import { CACHE_SIZE_UNLIMITED, initializeFirestore } from "firebase/firestore";
import { initializeAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: process.env.REACT_APP_apiKey,
	authDomain: process.env.REACT_APP_authDomain,
	projectId: process.env.REACT_APP_projectId,
	storageBucket: process.env.REACT_APP_storageBucket,
	messagingSenderId: process.env.REACT_APP_messagingSenderId,
	appId: process.env.REACT_APP_appId,
};

export let app = initializeApp(firebaseConfig);

if (!app) {
	app = initializeApp(firebaseConfig);
}

export const db = initializeFirestore(app, { cacheSizeBytes: CACHE_SIZE_UNLIMITED });
export const auth = initializeAuth(app);