import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from '../infrastructure/http/middlewares/errorHandler.js';
import { assetRoutes } from '../infrastructure/http/routes/assetRoutes.js';
import { openApiDocument } from './docs/openApi.js';

const app = express();
const port = process.env.PORT ?? 3333;

app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use('/api/v1', assetRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`AssetTracker API running on port ${port}`);
});
