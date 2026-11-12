import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { env } from '../infrastructure/config/env.js';
import { corsOptions } from '../infrastructure/http/config/corsOptions.js';
import { helmetOptions } from '../infrastructure/http/config/helmetOptions.js';
import { errorHandler } from '../infrastructure/http/middlewares/errorHandler.js';
import { requestLogger } from '../infrastructure/http/middlewares/requestLogger.js';
import { assetRoutes } from '../infrastructure/http/routes/assetRoutes.js';
import { authRoutes } from '../infrastructure/http/routes/authRoutes.js';
import { investorRoutes } from '../infrastructure/http/routes/investorRoutes.js';
import { marketRoutes } from '../infrastructure/http/routes/marketRoutes.js';
import { parseCookies } from '../infrastructure/http/middlewares/parseCookies.js';
import { openApiDocument } from './docs/openApi.js';

const app = express();
const port = env.PORT;

app.use(helmet(helmetOptions));
app.use(cors(corsOptions));
app.use(express.json());
app.use(parseCookies);
app.use(requestLogger);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use('/api/v1', assetRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', investorRoutes);
app.use('/api/v1', marketRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`AssetTracker API running on port ${port}`);
});
