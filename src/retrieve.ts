import postgres from "postgres";
import {embed} from "./embed";

const sql = postgres(process.env.DATABASE_URL);

export interface RetrievedChunk {
  content: string;
  source: string;
  similarity: number;
}

export async function retrieve(
  query: string,
  topK = 5
): Promise<RetrievedChunk[]> {
  const queryEmbedding = await embed(query);

  console.log(JSON.stringify(queryEmbedding).slice(80))

  // <=> cosine distance; 1 - distance = similarity
  const rows = await sql<RetrievedChunk[]>`
    SELECT
      content,
      source,
      1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) AS similarity
    FROM documents
    ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector
    LIMIT ${topK}
  `

  return rows
}
