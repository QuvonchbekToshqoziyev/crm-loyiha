import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { AdminModule } from './modules/admin/admin.module';
import { StudentsModule } from './modules/students/students.module';
import { GroupsModule } from './modules/groups/groups.module';
import { CoursesModule } from './modules/courses/courses.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { StudentGroupModule } from './modules/studentgroup/studentgroup.module';
import { LessonModule } from './modules/lesson/lesson.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { HomeworkModule } from './modules/homework/homework.module';
import { SubmissionModule } from './modules/submission/submission.module';
import { GradeModule } from './modules/grade/grade.module';
import { PrismaModule } from './core/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TeachersModule,
    AdminModule,
    StudentsModule,
    GroupsModule,
    CoursesModule,
    RoomsModule,
    StudentGroupModule,
    LessonModule,
    AttendanceModule,
    HomeworkModule,
    SubmissionModule,
    GradeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
