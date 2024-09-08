import { collection, doc, getDoc } from "firebase/firestore";
import { auth } from '@clerk/nextjs/server';
import { db } from "../../firebase";
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

export async function GET(req) {
  try {
    // Extract VIN from the query parameters
    const url = new URL(req.url);
    const vin = url.searchParams.get('vin');
    
    if (!vin) {
      return NextResponse.json({ success: false, message: 'VIN parameter is required' }, { status: 400 });
    }

    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ success: false, message: 'User id not found' }, { status: 400 });
    }

    // Query Firestore for the specific VIN record belonging to this user
    const vinDocRef = doc(db, 'vin_records', vin);
    const vinDoc = await getDoc(vinDocRef);

    if (!vinDoc.exists()) {
      return NextResponse.json({ success: false, message: 'No data found for the specified VIN' }, { status: 404 });
    }

    const vinData = {
      vin: vinDoc.id,
      ...vinDoc.data(),
    };

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    async function embed(attributes) {
      try {
        const attributesString = attributes.map(attr => JSON.stringify(attr));
        const embeddings = [];

        for (let i = 0; i < attributesString.length; i += 50) { // Adjust batch size as needed
          const batch = attributesString.slice(i, i + 50);
          const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: batch,
          });

          embeddings.push(...embeddingResponse.data);
        }

        return embeddings;
      } catch (error) {
        console.error('Error fetching embeddings:', error);
        throw new Error('Failed to fetch embeddings');
      }
    }

    // Embed the specific VIN's attributes
    const embeddingResult = await embed([vinData.attributes]);

    console.log('VIN Data:', vinData);
    console.log('Embedding Request:', vinData.attributes);
    console.log('Embedding Result:', embeddingResult);

    if (!embeddingResult || embeddingResult.length !== 1) {
      throw new Error('The number of embeddings returned does not match the number of input records.');
    }

    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pc.index('mechanicare');

    const vector = {
      id: vinData.vin,
      values: embeddingResult[0].embedding,
      metadata: {
        vin: vinData.vin,
        userId: vinData.userId,
        attributes: JSON.stringify(vinData.attributes),
        recalls: JSON.stringify(vinData.recalls),
      }
    };

    await index.namespace('ns1').upsert([vector]);

    return NextResponse.json({
      success: true,
      data: vinData,
      embeddings: embeddingResult,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
