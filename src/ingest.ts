import postgres from "postgres";
import {embed} from "./embed";
import {chunkText} from "./chunk";
import * as fs from "fs"
import "dotenv/config"

const sql = postgres(process.env.DATABASE_URL);

export async function ingestFile(filePath: string): Promise<void> {
  const text = fs.readFileSync(filePath, "utf-8")
  const chunks = chunkText(text, filePath)

  console.log(`Ingesting ${chunks.length} chunks from ${filePath}...`)

  for (const chunk of chunks) {
    const embedding = await embed(chunk.content)

    console.log(`chunk content ${chunk.content}, chunk source ${chunk.source}, chunk embedding ${JSON.stringify(embedding)}`)

    await sql`
      INSERT INTO documents (content, source, embedding)
      VALUES (
        ${chunk.content},
        ${chunk.source},
        ${JSON.stringify(embedding)}::vector
      )
    `;
  }

  console.log('Done.');
  await sql.end();
}

ingestFile(process.argv[2]);
