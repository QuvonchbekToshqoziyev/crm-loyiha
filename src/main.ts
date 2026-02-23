import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  const config = new DocumentBuilder()
    .setTitle('Education Platform API')
    .setDescription('Comprehensive REST API for managing educational institution operations including student enrollment, course management, teacher assignments, and resource allocation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User registration and login endpoints')
    .addTag('Users', 'User management operations (Admin only)')
    .addTag('Students', 'Student profile and search operations')
    .addTag('Teachers', 'Teacher profile and search operations')
    .addTag('admin', 'Admin profile and search operations')
    .addTag('Courses', 'Course management and catalog operations')
    .addTag('Groups', 'Class group management and scheduling')
    .addTag('Rooms', 'Room and facility management')
    .addTag('Lessons', 'Lesson scheduling and topic management')
    .addTag('Attendance', 'Student attendance tracking per lesson')
    .addTag('Homework', 'Homework assignment management')
    .addTag('Submissions', 'Student homework submission operations')
    .addTag('Grades', 'Homework grading and score management')
    .addTag('Enrollments', 'Student enrollment and group assignment operations')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
    }
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log(`🚀 Application running on: http://localhost:${port}`, 'Bootstrap');
  Logger.log(`📚 API Documentation: http://localhost:${port}/api`, 'Bootstrap');
}
bootstrap(); 
