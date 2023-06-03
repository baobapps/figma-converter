import { describe, test, expect, it } from 'vitest';
import { isUrl } from '../src/utils/string';
import { figmaFileIdFromUrl, writeContentInoTempDirectory } from '../src/utils/figma';
import * as fs from 'fs';
import * as path from 'path';

describe('utils', () => {
  test('isUrl', () => {
    expect('https://google.com').toSatisfy(isUrl);
    expect(
      'https://www.figma.com/file/FILE_ID_HERE/Sark---Landing-Page-Kit?type=design&t=6J2osvEC88OsLjpd-6',
    ).toSatisfy(isUrl);
  });

  test('getFigmaFileIdFromUrl', () => {
    const id = 'FILE_ID_HERE';
    expect(figmaFileIdFromUrl(`https://www.figma.com/file/${id}/title?type=design`)).toBe(id);
  });

  it('write Json Ino Temp Directory', async () => {
    const file = await writeContentInoTempDirectory({
      content: JSON.stringify({ name: 'test' }),
      filename: 'test.json',
    });
    expect(file).toContain('test.json');
    expect(fs.existsSync(path.join(__dirname, '..', 'tmp', 'test.json'))).toBe(true);
    fs.unlinkSync(path.join(__dirname, '..', 'tmp', 'test.json'));
    expect(fs.existsSync(path.join(__dirname, '..', 'tmp', 'test.json'))).toBe(false);
  });
});
