import * as dotenv from 'dotenv';
import * as fs from 'fs';

if (fs.existsSync('.env.development')) {
  dotenv.config({ path: '.env.development' });
} else {
  dotenv.config();
}
