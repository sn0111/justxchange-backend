import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import productRouter from './api/routes/product.routes';
import categoryRoutes from './api/routes/category.routes';
import initializeModels from './db/models';
const swaggerDocument = require('./api/docs/swagger-output.json');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

const app = express();

// Middleware for JSON parsing
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', productRouter);
app.use('/api', categoryRoutes);


// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Initialize models and then start the server
initializeModels().then(() => {
  const PORT = process.env.PORT || 8090;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
