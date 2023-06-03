import fs from 'fs/promises';
import path from 'path';
import { fileExists, stringIntoSnakeCase } from './string';
import { FigmaDocument } from '../types/figma';
import { getFigmaFile } from '../figma';

const figmaFileIdFromUrl = (url: string) => {
  const regex = /https:\/\/www\.figma\.com\/file\/([^\/]+)\/.*/;

  const match = url.match(regex);
  return match ? match[1] : '';
};

const tmpPath = async (values: string[]) => {
  const paths = [__dirname, '..', '..', 'tmp', ...values];

  const fullPath = path.join(...paths);

  // tslint:disable-next-line:no-console
  console.log(fullPath);

  await fs.mkdir(path.dirname(fullPath), { recursive: true });

  return fullPath;
};

const writeContentInoTempDirectory = async ({
  content,
  filename,
  parent,
}: {
  content: any;
  filename: string;
  parent?: string;
}): Promise<string> => {
  const fullPath = path.join(__dirname, '..', '..', 'tmp', parent || '', filename);

  await fs.mkdir(path.dirname(fullPath), { recursive: true });

  await fs.writeFile(fullPath, content);

  return fullPath;
};

const figmaTmpFilename = (figmaFileKey: string) => {
  return `file-${stringIntoSnakeCase(figmaFileKey)}.json`;
};

const getCachedFigmaFile = async (figmaFileKey: string): Promise<FigmaDocument> => {
  if (!figmaFileKey) {
    throw new Error('figmaFileKey is required');
  }

  const filename = figmaTmpFilename(figmaFileKey);

  if (fileExists(await tmpPath([figmaFileKey, filename]))) {
    return (await JSON.parse(await fs.readFile(await tmpPath([figmaFileKey, filename]), 'utf8'))) as FigmaDocument;
  }

  const file = await getFigmaFile(figmaFileKey);

  await writeContentInoTempDirectory({
    content: JSON.stringify(file, null, 2),
    filename,
    parent: figmaFileKey,
  });

  return file;
};

export { figmaFileIdFromUrl, writeContentInoTempDirectory, figmaTmpFilename, getCachedFigmaFile };
