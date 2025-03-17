import { Configuration, OpenAIApi } from 'openai-edge';

// Create an OpenAI API client (that's edge-friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// IMPORTANT: Set the runtime to edge for streaming responses
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, parameters } = await req.json();
    const { topic, tone, jokeType, temperature } = parameters;

    // Enhanced system and user prompts for better joke generation
    const systemPrompt = `You are a world-class stand-up comedian known for your perfect timing and clever humor. You excel at:
                          - Crafting ${tone} jokes that land perfectly
                          - Creating unexpected but delightful punchlines
                          - Reading the room and keeping things appropriate
                          - Making complex topics simple and funny
                          - Using perfect setup-punchline timing

                          Your jokes are always original, quotable, and leave people laughing.`;

    const prompt = `Create a ${tone} joke that will genuinely make people laugh.${
      topic !== 'anything' ? ` The topic is "${topic}" - use it in a clever, unexpected way.` : ' Choose a relatable topic.'
    }${
      jokeType !== 'any' ? ` Structure it as a ${jokeType} joke with perfect timing.` : ' Pick the most effective joke format.'
    } Focus on the punchline and make it memorable.`;

    const response = await openai.createChatCompletion({
      model: 'gpt-4o',
      stream: true,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        ...messages,
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: temperature,
    });

    // Return the response with streaming headers
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'There was an error generating your joke' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 