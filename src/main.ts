import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { json, urlencoded } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ViewExceptionFilter } from './shared/view-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  // Do NOT use global pipes with the validation pipe. It is currently very hard to override certain values for specific methods
  // app.useGlobalPipes(new ValidationPipe({
  //   // transform: true,
  //   // forbidUnknownValues: true,
  //   // validationError: { target: false }
  // }));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });


  const options = new DocumentBuilder()
    .setTitle('Basic API')
    .setDescription('The Basic API is here to support users with login, registration, profile information and news items')
    .setVersion('1.0')
    .addTag('Basic API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  app.enableCors();
  app.use(json({ limit: '20kb' }));
  app.use(urlencoded());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.useGlobalFilters(new ViewExceptionFilter());
  
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
