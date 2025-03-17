import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Enhanced system and user prompts for better joke generation
  const systemPrompt = `You are a world-class stand-up comedian known for your perfect timing and clever humor. You excel at:
  - Crafting jokes that land perfectly
  - Creating unexpected but delightful punchlines
  - Reading the room and keeping things appropriate
  - Making complex topics simple and funny
  - Using perfect setup-punchline timing

  Your jokes are always original, quotable, and leave people laughing.`;

  const result = await streamText({
    model: openai("gpt-4o"),
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages,
    ],
  });
  return result.toDataStreamResponse();
}
