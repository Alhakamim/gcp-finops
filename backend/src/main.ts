import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['https://finops.a3hd.com'],
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  const prefix = 'api/v1';
  app.setGlobalPrefix(prefix);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('GCP FinOps API')
    .setDescription('Enterprise Google Cloud Billing Analytics Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication & authorization')
    .addTag('billing', 'Billing accounts & cost data')
    .addTag('analytics', 'Cost analytics & forecasting')
    .addTag('budgets', 'Budget management & alerts')
    .addTag('invoices', 'Invoice management')
    .addTag('reports', 'Report generation & scheduling')
    .addTag('customers', 'Customer management (multi-tenant)')
    .addTag('admin', 'Admin settings & audit logs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${prefix}/docs`, app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}/${prefix}`);
  logger.log(`Swagger: http://localhost:${port}/${prefix}/docs`);
}
bootstrap();
