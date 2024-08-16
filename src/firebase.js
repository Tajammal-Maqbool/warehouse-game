import { initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBMf7Qp8GfhQbz1KV0DtOe6OtjJBKVA14g",
    authDomain: "warehouse-24d4f.firebaseapp.com",
    projectId: "warehouse-24d4f",
    storageBucket: "warehouse-24d4f.appspot.com",
    messagingSenderId: "900183776182",
    appId: "1:900183776182:web:1069a80c49b1f5237ebf17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const registerUser = async (username, score) => {
    const db = getFirestore(app);
    const userRef = collection(db, "users");
    try {
        const q = query(userRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0].data();
            if (doc) {
                return false;
            }
        }
        let doc = await addDoc(userRef, {
            username,
            score: score
        });
        return doc.id;
    }
    catch (e) {
        console.error("Error getting document:", e);
        return null;
    }
}

export const updateUserScore = async (userId, newScore) => {
    const db = getFirestore(app);
    const userRef = doc(db, "users", userId);
    try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            const doc = docSnap.data();
            await updateDoc(userRef, {
                score: doc.score > newScore ? newScore : doc.score
            });
            return true;
        }
        return false;
    }
    catch (e) {
        console.error("Error getting document:", e);
        return null;
    }
}

export const getLeaderboard = async () => {
    const db = getFirestore(app);

    const infoRef = collection(db, "info");
    try {
        const querySnapshot = await getDocs(infoRef);
        const doc = !querySnapshot.empty ? querySnapshot.docs[0].data() : null;
        if (querySnapshot.docs.length > 1) {
            querySnapshot.docs.forEach(async (doc, index) => {
                if (index > 0) {
                    await deleteDoc(doc.ref);
                }
            });
        }
        const current = new Date();
        let lastCleared = null;
        if (doc) {
            lastCleared = new Date(doc.lastCleared);
            const diffTime = Math.abs(current - lastCleared);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= 30) {
                const userRef = collection(db, "users");
                const userQuerySnapshot = await getDocs(userRef);
                if (!userQuerySnapshot.empty) {
                    userQuerySnapshot.docs.forEach(async userDoc => {
                        await deleteDoc(userDoc.ref);
                    });
                }
                // set first date of the month as last cleared date
                await updateDoc(querySnapshot.docs[0].ref, {
                    lastCleared: new Date(current.getFullYear(), current.getMonth(), 1).toISOString()
                });
            }
        } else {
            await addDoc(infoRef, {
                lastCleared: current.toISOString()
            });
        }
    } catch (e) {
        console.error("Error getting or updating document:", e);
    }


    const userRef = collection(db, "users");
    try {
        const querySnapshot = await getDocs(userRef);
        if (querySnapshot.empty) return [];
        let users = querySnapshot.docs.map(doc => doc.data());
        users.sort((a, b) => a.score - b.score);
        return users.slice(0, 20);
    }
    catch (e) {
        console.error("Error getting document:", e);
        return [];
    }
}