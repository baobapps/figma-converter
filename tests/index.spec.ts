import '../src/environments';

import { test, expect } from 'vitest';

test('env variables', () => {
  expect(process.env.ENV_FILENAME).toBe('.env.development');
});
