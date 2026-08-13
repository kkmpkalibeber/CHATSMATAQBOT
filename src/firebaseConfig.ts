import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { CustomKnowledgeItem } from "./types";

// Firebase configuration using environment variables or safe defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyApiKeyForStaticBuilds123456",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "smataq-bot.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smataq-bot",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "smataq-bot.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Firestore collection references
const KNOWLEDGE_COLLECTION = "smataq_custom_knowledge";
const UNANSWERED_COLLECTION = "smataq_unanswered_questions";

/**
 * Fetch all custom knowledge items from Firestore with LocalStorage fallback
 */
export async function fetchCustomKnowledgeFromCloud(): Promise<CustomKnowledgeItem[]> {
  try {
    const querySnapshot = await getDocs(collection(db, KNOWLEDGE_COLLECTION));
    const items: CustomKnowledgeItem[] = [];
    querySnapshot.forEach((docSnap) => {
      items.push(docSnap.data() as CustomKnowledgeItem);
    });

    if (items.length > 0) {
      // Sync local storage cache
      localStorage.setItem("smataq_custom_knowledge", JSON.stringify(items));
      return items;
    }
  } catch (err) {
    console.warn("Firestore fetch error, fallback to localStorage:", err);
  }

  // Fallback to localStorage cache
  const saved = localStorage.getItem("smataq_custom_knowledge");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  }
  return [];
}

/**
 * Save / sync custom knowledge array to both Firestore and LocalStorage
 */
export async function saveCustomKnowledgeToCloud(items: CustomKnowledgeItem[]): Promise<void> {
  // Always update local storage first for immediate UI reactivity
  localStorage.setItem("smataq_custom_knowledge", JSON.stringify(items));

  try {
    // Sync each item to Firestore
    for (const item of items) {
      const docRef = doc(db, KNOWLEDGE_COLLECTION, item.id);
      await setDoc(docRef, item, { merge: true });
    }
  } catch (err) {
    console.warn("Firestore save batch warning:", err);
  }
}

/**
 * Delete a specific custom knowledge item from Firestore and LocalStorage
 */
export async function deleteCustomKnowledgeFromCloud(itemId: string, updatedItems: CustomKnowledgeItem[]): Promise<void> {
  localStorage.setItem("smataq_custom_knowledge", JSON.stringify(updatedItems));
  try {
    const docRef = doc(db, KNOWLEDGE_COLLECTION, itemId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Firestore delete document error:", err);
  }
}

/**
 * Clear all knowledge items from Firestore and LocalStorage
 */
export async function clearAllCustomKnowledgeFromCloud(): Promise<void> {
  localStorage.setItem("smataq_custom_knowledge", "[]");
  try {
    const querySnapshot = await getDocs(collection(db, KNOWLEDGE_COLLECTION));
    const deletePromises = querySnapshot.docs.map((d) => deleteDoc(doc(db, KNOWLEDGE_COLLECTION, d.id)));
    await Promise.all(deletePromises);
  } catch (err) {
    console.warn("Firestore clear error:", err);
  }
}

/**
 * Fetch unanswered questions from Firestore or LocalStorage
 */
export async function fetchUnansweredQuestionsFromCloud(): Promise<any[]> {
  try {
    const querySnapshot = await getDocs(collection(db, UNANSWERED_COLLECTION));
    const items: any[] = [];
    querySnapshot.forEach((docSnap) => {
      items.push(docSnap.data());
    });
    if (items.length > 0) {
      localStorage.setItem("smataq_unanswered_questions", JSON.stringify(items));
      return items;
    }
  } catch (err) {
    console.warn("Firestore unanswered questions fetch error:", err);
  }

  const saved = localStorage.getItem("smataq_unanswered_questions");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  }
  return [];
}

/**
 * Log an unanswered question to Firestore and LocalStorage
 */
export async function saveUnansweredQuestionToCloud(newItem: any): Promise<void> {
  try {
    const savedStr = localStorage.getItem("smataq_unanswered_questions") || "[]";
    const saved = JSON.parse(savedStr);
    const updated = [newItem, ...saved.filter((q: any) => q.id !== newItem.id)];
    localStorage.setItem("smataq_unanswered_questions", JSON.stringify(updated));

    const docRef = doc(db, UNANSWERED_COLLECTION, newItem.id);
    await setDoc(docRef, newItem, { merge: true });
  } catch (err) {
    console.warn("Firestore unanswered save error:", err);
  }
}
