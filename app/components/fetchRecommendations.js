import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust import path if needed

export async function fetchRecommendations(userId) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return data.recommendations || [];
    } else {
      console.error('No such document!');
      return [];
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
}