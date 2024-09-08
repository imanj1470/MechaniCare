import { collection, query, where, getDocs } from "firebase/firestore";
import { auth } from '@clerk/nextjs/server';
import { db } from "../../firebase";
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ success: false, message: 'User id not found' }, { status: 400 });
    }

    // Query the vin_records collection for all records belonging to this user
    const vinQuery = query(collection(db, 'vin_records'), where('userId', '==', userId));
    const vinSnapshot = await getDocs(vinQuery);

    if (vinSnapshot.empty) {
      return NextResponse.json({ success: false, message: 'No data found for the user' }, { status: 404 });
    }

    const vinData = vinSnapshot.docs.map((doc) => ({
      vin: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({
      success: true,
      data: vinData,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}