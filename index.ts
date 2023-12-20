import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getNicknamesFromFile(filePath: string) {
  const resolvedPath = path.resolve(__dirname, filePath);
  const file = await Bun.file(resolvedPath).text();
  const regex = /^[a-z0-9._]+$/;
  return file.split("\n").filter((line) => regex.test(line));
}

function findDifference<T>(arrayOne: T[], arrayTwo: T[]): T[] {
  const set = new Set(arrayOne);
  const difference: T[] = [];

  for (const value of arrayTwo) {
    if (!set.has(value)) {
      difference.push(value);
    }
  }

  return difference;
}

async function findUniqueLines(fileOnePath: string, fileTwoPath: string) {
  const [fileOneNicknames, fileTwoNicknames] = await Promise.all([
    getNicknamesFromFile(fileOnePath),
    getNicknamesFromFile(fileTwoPath),
  ]);

  return findDifference(fileOneNicknames, fileTwoNicknames);
}

Promise.all([
  findUniqueLines("following.txt", "followers.txt"),
  findUniqueLines("followers.txt", "following.txt"),
]).then(console.log);
