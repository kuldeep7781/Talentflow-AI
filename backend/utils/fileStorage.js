import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
const uploadRoot = path.resolve(process.cwd(), "uploads", "resumes");
export async function saveResume(file) {
  await mkdir(uploadRoot, { recursive: true });
  const filename = `${randomUUID()}.pdf`;
  const absolutePath = path.join(uploadRoot, filename);
  await writeFile(absolutePath, file.buffer, { flag: "wx" });
  return path.relative(process.cwd(), absolutePath).replaceAll("\\", "/");
}
