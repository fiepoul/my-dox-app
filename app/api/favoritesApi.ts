// src/api/favoritesApi.ts
import {
    doc,
    collection,
    getDocs,
    setDoc,
    deleteDoc,
    query,
  } from "firebase/firestore";
  import { db, auth } from "../_config/firebaseconfig"; 
  
  // Helper til at hente bruger-UID
  function getUid() {
    const user = auth.currentUser;
    if (!user) throw new Error("Ikke logget ind");
    return user.uid;
  }
  
  // Hent alle favoritter for nuværende bruger
  export async function fetchFavorites() {
    const uid = getUid();
    const favCol = collection(db, "users", uid, "favorites");
    const snap = await getDocs(favCol);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  
  // Tilføj en favorit
  export async function addFavorite(film: {
    id: number;
    title: string;
    posterUrl?: string;
  }) {
    const uid = getUid();
    const favDoc = doc(db, "users", uid, "favorites", film.id.toString());
    await setDoc(favDoc, {
      title: film.title,
      posterUrl: film.posterUrl || null,
      addedAt: Date.now()
    });
  }
  
  // Fjern en favorit
  export async function removeFavorite(filmId: number) {
    const uid = getUid();
    const favDoc = doc(db, "users", uid, "favorites", filmId.toString());
    await deleteDoc(favDoc);
  }