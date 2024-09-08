import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust import path if needed
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { userId, recommendation } = await req.json();

    // Ensure valid data
    if (!userId || typeof recommendation !== 'string') {
      return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
    }

    // Create a recommendation object with text and date
    const recommendationObject = {
      text: recommendation,
      date: new Date().toISOString(),
    };

    // Reference to the users collection and the specific user document
    const userDocRef = doc(db, 'users', userId);

    // Update the recommendations field by appending the new recommendation object
    await updateDoc(userDocRef, {
      recommendations: arrayUnion(recommendationObject),
    });

    return NextResponse.json({ success: true, message: 'Recommendation added successfully' });
  } catch (error) {
    console.error('Error adding recommendation:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}