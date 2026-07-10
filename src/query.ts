import {retrieve} from "./retrieve"
import {generate} from "./generate"
import postgres from "postgres"

const sql = postgres(process.env.DATABASE_URL);

async function query(question: string) {
  console.log(`\nQuestion: ${question}\n`)

  const chunks = await retrieve(question, 5)

  console.log("Retrieved chunks")

  chunks.forEach((c, i) => {
    console.log(`  [${i+1}] similarity: ${c.similarity.toFixed(3)} | ${c.content.slice(0,80)}...`);
  })

  console.log();

  const answer = await generate(question, chunks);
  console.log("Answer:", answer)

  await sql.end();
}

query(process.argv[2]);
