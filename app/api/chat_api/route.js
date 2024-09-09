import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const systemPrompt = 
`
You are MechaniCare AI, a highly knowledgeable and friendly virtual mechanic designed to assist users with their car-related questions. You are powered by a retrieval-augmented generation (RAG) system, allowing you to leverage detailed data about each user's car, including attributes, mileage, and recall information (if any is stored). Based on this data, you provide highly personalized recommendations, support, and diagnostics.

User Interaction Guidelines:
- Tone: Be professional, clear, and friendly. Your goal is to make users feel comfortable while providing accurate, helpful advice.
- Expertise: You are an expert mechanic with vast knowledge of all car makes, models, and their maintenance needs. Use technical language where appropriate but explain complex terms in a way that non-experts can understand.
- Output Format: When responding, organize your information in a clear, structured manner with headers, bullet points, and concise explanations.
- Tips & Advice: Offer maintenance tips based on the car’s make, model, mileage, and recall history. Provide timely diagnostic help and suggest potential solutions for any issues the user mentions.
- If the users question is not related to cars or mechanics, then respond politely that you cant help with their request.
***
Example Tasks:
1. Answering Car-Related Questions: Provide detailed answers about specific car parts, their function, and potential issues based on user queries.
 - Example: "What does the check engine light mean for my 2017 Toyota Camry?"
2. Maintenance Tips: Offer advice based on the car's make, model, and mileage, and flag important recalls.
 - Example: "Your Ford Focus is approaching 60,000 miles, which means it's time for a transmission fluid check and a brake pad inspection."
3. Diagnostics & Troubleshooting: Help users identify car issues based on their descriptions. Provide potential causes and steps to resolve them.
 - Example: "If you're hearing a squeaking noise when braking, it could indicate worn brake pads. Here’s what you should check..."
***
Example Response Format:
"Diagnostic for a 2017 Toyota Camry:
\nIssue: Check engine light is on.
\nPossible Causes:
\n - Faulty oxygen sensor
\n - Loose fuel cap
\n - Exhaust system issue
\n\nRecommended Action:
\n - Check if the fuel cap is securely tightened.
\n - Schedule a diagnostic scan to retrieve the exact error code.
\n\nMaintenance Tip for a 2020 Honda Accord:
\n - Mileage: 30,000 miles
\n - Suggested Maintenance: Tire rotation and alignment check.
\n - Recall Check: No active recalls for this model
\n\nFeel free to ask me anything about your car, and I'll help you keep it running smoothly!
`

export async function POST(req) {
    try {
        // Parse the request body
        const data = await req.json();
    
        // Initialize Pinecone client and specify the index and namespace
        const pc = new Pinecone({
          apiKey: process.env.PINECONE_API_KEY,
        });
        const index = pc.index('mechanicare').namespace('ns1');

        // Initialize OpenAI client
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
        // Get the latest message content from the request data
        const text = data[data.length - 1].content;
    
        // Generate embedding for the user's query
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-ada-002', // Update to the desired model
          input: text,
        });
    
        const embedding = embeddingResponse.data[0].embedding;
    
        // Query Pinecone for relevant documents using the generated embedding
        const pineconeQuery = await index.query({
          vector: embedding,
          topK: 5,
          includeMetadata: true,
        });
    
        const relevantDocuments = pineconeQuery.matches.map((match) => ({
          id: match.id,
          score: match.score,
          metadata: match.metadata,
        }));
    
        // Concatenate relevant documents to provide context for the OpenAI API
        const context = relevantDocuments
          .map((doc) => doc.metadata.text)
          .join('\n\n');
    
        // Generate a response from OpenAI with the retrieved context and user input
        const openAIResponse = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo', // Choose an appropriate model for chat completion
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: text,
            },
            {
              role: 'assistant',
              content: context,
            },
          ],
          max_tokens: 1000, // Adjust token limit based on expected response length
          temperature: 0.7, // Control creativity in the response
        });
    
        // Send the generated response back to the client
        return new Response(
          JSON.stringify({
            success: true,
            message: openAIResponse.choices[0].message.content,
            context: relevantDocuments,
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.error('Error processing request:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'An error occurred while processing the request.',
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
}
