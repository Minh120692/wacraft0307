import fs from "node:fs/promises";
import path from "node:path";

export async function POST(request) {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData.entries());
  const outputPath = path.join(process.cwd(), "tmp", "contact-submissions.ndjson");

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.appendFile(
    outputPath,
    `${JSON.stringify({ submittedAt: new Date().toISOString(), ...payload })}\n`,
    "utf8",
  );

  return new Response("OK", {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
