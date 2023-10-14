import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getNicknamesInFile(pathString: string) {
  const resolvedPath = path.resolve(__dirname, pathString);
  const file = await Bun.file(resolvedPath).text();
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
  findUniqueLines("subscriptions.txt", "subscribers.txt"),
  findUniqueLines("subscribers.txt", "subscriptions.txt"),
]).then(console.log);
