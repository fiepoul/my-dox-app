import {
    getFirestore,
    doc,
    getDoc,
    collection,
    getDocs,
  } from 'firebase/firestore'
  import { getAuth } from 'firebase/auth'
  
  const db = getFirestore()
  
  export async function fetchFriendsFavorites() {
    const currentUser = getAuth().currentUser
    if (!currentUser) throw new Error('Not authenticated')
  
    const userRef = doc(db, 'users', currentUser.uid)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) return []
  
    const friendUids = userSnap.data().friends || []
    const allData = []
  
    for (const friendUid of friendUids) {
      const userDoc = await getDoc(doc(db, 'users', friendUid))
      const favsSnap = await getDocs(collection(db, 'users', friendUid, 'favorites'))
  
      const favorites = favsSnap.docs.map(doc => parseInt(doc.id))
      const friendData = userDoc.exists()
        ? userDoc.data()
        : { fullName: 'Unknown', username: 'unknown' }
  
      allData.push({
        uid: friendUid,
        favorites,
        fullName: friendData.fullName,
        username: friendData.username,
      })
    }
  
    return allData
  }
  