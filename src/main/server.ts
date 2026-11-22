import { env } from '../infrastructure/config/env.js';
import { app } from './app.js';

const port = env.PORT;

app.listen(port, () => {
  console.log(`AssetTracker API running on port ${port}`);
});
