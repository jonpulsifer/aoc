import fetch from 'cross-fetch';
import { mkdirSync, writeFileSync } from 'fs';
import * as path from 'path';

const now = new Date();
const year = now.getFullYear().toString();
const day = process.argv[2] || now.getDate().toString();
const url = `https://adventofcode.com/${year}/day/${day}/input`;
const cookie = process.env.AOC_SESSION_COOKIE || '';
if (!cookie) throw new Error('AOC session cookie not set');

const headers = {
  cookie: `session=${cookie}`
}

async function fetchInput(url: string, cookie: string ): Promise<string> {
  const response = await fetch(
    url,
    { headers }
  );
  if (response.ok) return await response.text();
  throw new Error(`Could not download input for ${year}-${day}`);
};

function saveInput(): void {
  const outputDir = path.resolve('.', year);
  try {
    mkdirSync(outputDir);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw new Error(`${error.code}: could not create directory`);
    };
  };
  fetchInput(url, cookie).then(input => {
    writeFileSync(path.resolve(outputDir, `day${day.padStart(2, '0')}.txt`), input);
    console.log(`Wrote ${input.length} bytes to ${outputDir}`);
  });
}

saveInput();
