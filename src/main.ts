import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { env } from '~/env';
import { join } from 'path';
import * as hbs from 'hbs';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { TokenMiddleware } from './middleware/token.middleware';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Static assets and view engine configuration
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views/partials'));
  app.set('view options', { layout: 'index' });
  app.setViewEngine('hbs');

  // Middleware
  const loggerMiddleware = new LoggerMiddleware();
  const tokenMiddleware = new TokenMiddleware();
  app.use(cookieParser());
  // app.use(loggerMiddleware.use);
  app.use(tokenMiddleware.use);

  await app.listen(env.SERVER_PORT);
}
bootstrap();
