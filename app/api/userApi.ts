import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    collection,
    query,
    where,
    getDocs,
    arrayRemove,
  } from 'firebase/firestore'
  import { getAuth } from 'firebase/auth'
  
  const db = getFirestore()
  
  export async function findUserByUsername(username: string) {
    const q = query(collection(db, 'users'), where('username', '==', username))
    const snapshot = await getDocs(q)
    if (snapshot.empty) return null
    const docSnap = snapshot.docs[0]
    return { uid: docSnap.id, ...docSnap.data() }
  }
  
  export async function addFriendByUsername(username: string) {
    const friend = await findUserByUsername(username)
    if (!friend) throw new Error('User not found')
    const currentUser = getAuth().currentUser
    if (!currentUser) throw new Error('Not authenticated')
  
    if (friend.uid === currentUser.uid) {
      throw new Error("You can't add yourself")
    }
  
    const userRef = doc(db, 'users', currentUser.uid)
    const friendRef = doc(db, 'users', friend.uid)
  
    // Tilføj venskab begge veje
    await updateDoc(userRef, {
      friends: arrayUnion(friend.uid),
    })
  
    await updateDoc(friendRef, {
      friends: arrayUnion(currentUser.uid),
    })
  }

  export async function fetchCurrentUserData(): Promise<{
    uid: string;
    fullName: string;
    username: string;
  }> {
    const currentUser = getAuth().currentUser;
    if (!currentUser) throw new Error('Not authenticated');
  
    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);
  
    if (!userSnap.exists()) throw new Error('User not found');
  
    const data = userSnap.data();
  
    return {
      uid: currentUser.uid,
      fullName: data.fullName ?? '',
      username: data.username ?? '',
    };
  }
  
  
  export async function removeFriend(uidToRemove: string) {
    const currentUser = getAuth().currentUser
    if (!currentUser) throw new Error('Not authenticated')
  
    const currentRef = doc(db, 'users', currentUser.uid)
    const targetRef = doc(db, 'users', uidToRemove)
  
    // Fjern begge veje
    await updateDoc(currentRef, {
      friends: arrayRemove(uidToRemove),
    })
  
    await updateDoc(targetRef, {
      friends: arrayRemove(currentUser.uid),
    })
  }
  