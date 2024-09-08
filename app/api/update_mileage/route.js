import { doc, updateDoc } from "firebase/firestore";
import { auth } from '@clerk/nextjs/server';
import { db } from "../../firebase";
import { NextResponse } from 'next/server';

// API route handler for updating mileage
export async function POST(req) {
  try {
    const { vin, mileage } = await req.json();

    // Ensure valid data
    if (!vin || mileage === undefined) {
      return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
    }

    // Get the user ID from the auth session
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User id not found' }, { status: 400 });
    }

    // Reference to the vin_records collection
    const vinDocRef = doc(db, 'vin_records', vin);

    // Update mileage in the document
    await updateDoc(vinDocRef, {
      mileage,
    });

    return NextResponse.json({ success: true, message: 'Mileage updated successfully' });
  } catch (error) {
    console.error('Error updating mileage:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}