import Anthropic from "@anthropic-ai/sdk"
import { RetrievedChunk } from "./retrieve"

const anthropic = new Anthropic();

export async function generate(
  query: string,
  context: RetrievedChunk[]
): Promise<string> {
  const contextText = context
    .map((c, i) => `[${i + 1}] (source: ${c.source})\n${c.content}`)
    .join("\n\n---\n\n")

    console.log(contextText)

  const systemPrompt = `You are a helpful assistant. Answer the user's question 
using ONLY the provided context. If the context doesn't contain enough information 
to answer, say so explicitly. Cite sources by their bracketed number [1], [2], etc.`;

  const userMessage = `Context:\n${contextText}\n\nQuestion: ${query}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{role: 'user', content: userMessage}]
  })

  return response.content[0].type === "text" ? response.content[0].text : "";
}
