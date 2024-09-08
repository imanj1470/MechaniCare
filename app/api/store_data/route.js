import { doc, setDoc, collection } from "firebase/firestore";
import { auth } from '@clerk/nextjs/server';
import { db } from "../../firebase";
import { NextResponse } from 'next/server';

const formatAttributes = (attributesList) => {
  return attributesList.reduce((acc, item) => {
    const [key, value] = item.split(':');
    if (key && value) {
      acc[key.trim()] = value.trim().replace(/\s+$/, '');
    }
    return acc;
  }, {});
};

// API route handler
export async function POST(req) {
  try {
    const { vin, apiResponse } = await req.json();

    // Ensure valid data
    if (!vin || !apiResponse || !apiResponse.message) {
      return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
    }

    const { attributes_list, recall_list } = apiResponse.message;

    // Get the user ID from the auth session
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User id not found' }, { status: 400 });
    }

    // Prepare data for Firestore
    const attributes = formatAttributes(attributes_list);
    const recalls = formatAttributes(recall_list);

    // Reference to the vin_records collection
    const vinDocRef = doc(collection(db, 'vin_records'), vin);

    // Set data in the document
    await setDoc(vinDocRef, {
      userId, // Associate the VIN record with the user
      attributes,
      recalls,
    });

    return NextResponse.json({ success: true, message: 'Data stored successfully' });
  } catch (error) {
    console.error('Error storing data:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}