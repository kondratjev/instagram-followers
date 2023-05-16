import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getNicknamesInFile(pathString: string) {
  const resolvedPath = path.resolve(__dirname, pathString);
  const file = await fs.readFile(resolvedPath, "utf-8");
  const regex = /^[a-zA-Z0-9._]+$/;
  return file.split("\n").filter((line) => regex.test(line));
}

async function findUniqueLines(file1: string, file2: string) {
  const result: string[] = [];

  const [file1Lines, file2Lines] = await Promise.all([
    getNicknamesInFile(file1),
    getNicknamesInFile(file2),
  ]);

  for (const line of file1Lines) {
    if (!file2Lines.includes(line)) {
      result.push(line);
    }
  }

  return result;
}

Promise.all([
  findUniqueLines("./data/subscriptions.txt", "./data/subscribers.txt"),
  findUniqueLines("./data/subscribers.txt", "./data/subscriptions.txt"),
]).then(console.log);
