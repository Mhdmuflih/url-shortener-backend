import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // cors Connection
  // ===================================================================================
  app.enableCors({
    origin: process.env.FRONTEND, // Ensure the variable is correctly named
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  // ===================================================================================


  // mongodb connection
  // ===================================================================================
  const mongoURL = configService.get<string>("mongoURL");
  if (!mongoURL) {
    console.error("❌ MongoDB URL not found in environment variables.");
    process.exit(1);
  }

  try {
    const connect = await mongoose.connect(mongoURL, { dbName: 'Booking' });
    console.log(`✅ MongoDB connected successfully at host: ${connect.connection.host}`);
  } catch (error: any) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
  // ===================================================================================

  // server running port
  // ===================================================================================
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Server running on: http://localhost:${PORT}`);
  // ===================================================================================

}
bootstrap();
