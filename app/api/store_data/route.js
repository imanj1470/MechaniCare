
import { doc, setDoc ,collection} from "firebase/firestore";
import { auth, currentUser } from '@clerk/nextjs/server'
import {db} from "../../firebase"
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
    console.log('Received data:', { vin, apiResponse });

    // Ensure valid data
    if (!vin || !apiResponse || !apiResponse.message) {
      return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
    }

    const { attributes_list, recall_list } = apiResponse.message;

    const { userId } = auth()
    console.log(userId)
    

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User id not found' }, { status: 400 });
    }

    // Prepare data for Firestore
    const attributes = formatAttributes(attributes_list);
    const recalls = formatAttributes(recall_list);

    // Create document in Firestore


    /* const docRef = doc(collection(db, "users"), userId);
    await setDoc(docRef, {
      vin,
      attributes,
      recalls,
    }); */

    const userDocRef = doc(collection(db, 'users'), userId);
    const vinCollectionRef = collection(userDocRef, vin);

    await setDoc(doc(vinCollectionRef, 'attributes'), attributes);
    await setDoc(doc(vinCollectionRef, 'recalls'), recalls);

    return NextResponse.json({ success: true, message: 'Data stored successfully' });
  } catch (error) {
    console.error('Error storing data:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}