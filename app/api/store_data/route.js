import { db } from '../../firebase.js'
import { NextResponse } from 'next/server';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(req) {
    try {
      const { email } = await req.json();
  
      // Get the current date and time
      const currentDateTime = new Date();
      const formattedDateTime = currentDateTime.toISOString();
  
      // Add data to the Firestore collection
      await addDoc(collection(db, 'email'), {
        email: email,
        date: formattedDateTime, // Store formatted date and time
      });
  
      // Return a success response
      return NextResponse.json({ message: 'Email added to waitlist' }, { status: 200 });
    } catch (error) {
      console.error('Error storing email in Firestore:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }