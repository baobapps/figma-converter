import '../src/environments';

import { describe, expect, test } from 'vitest';
import { getMe } from '../src/figma';
import { getCachedFigmaFile, writeContentInoTempDirectory } from '../src/utils/figma';
import { convertFigmaFrameIntoHtml } from '../src/figma/html';
import { stringIntoSnakeCase } from '../src/utils/string';

describe.concurrent('user info', () => {
  test('getMe', async () => {
    const me = await getMe();

    expect(me).toHaveProperty('id');
    expect(me).toHaveProperty('handle');
    expect(me).toHaveProperty('email');
    expect(me).toHaveProperty('img_url');
  });
});

describe('file info', () => {
  test('getFigmaFile & SaveIt', async () => {
    const figmaFileKey = process.env.FIGMA_FILE_KEY!;

    const file = await getCachedFigmaFile(figmaFileKey);

    for (const page of file.document.children) {
      for (const frame of page.children) {
        await writeContentInoTempDirectory({
          content: await convertFigmaFrameIntoHtml(frame),
          filename: `${stringIntoSnakeCase(frame.name)}.html`,
          parent: figmaFileKey,
        });
      }
    }

    expect(file).toHaveProperty('document');
    expect(file).toHaveProperty('components');
    expect(file).toHaveProperty('schemaVersion');
    expect(file).toHaveProperty('lastModified');
    expect(file).toHaveProperty('thumbnailUrl');
    expect(file).toHaveProperty('version');
    expect(file).toHaveProperty('name');
    expect(file).toHaveProperty('role');
    expect(file).toHaveProperty('styles');
  }, 20000);
});
