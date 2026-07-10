export interface Chunk {
  content: string;
  source: string;
}

export function chunkText(
  text: string,
  source: string,
  chunkSize = 100,
  overlap = 10
): Chunk[] {
  const words = text.split(/\s+/)
  const chunks: Chunk[] = [];

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    const content = words.slice(i, i+chunkSize).join(" ");
    if (content.trim().length > 0) {
      chunks.push({content, source})
    }
  }

  return chunks;
}
