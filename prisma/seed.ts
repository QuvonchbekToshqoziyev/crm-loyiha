import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  await prisma.groupStudent.deleteMany();
  await prisma.group.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.course.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  const hashPassword = async (password: string) => {
    return bcrypt.hash(password, 10);
  };

  console.log('Creating users...');
  const [adminUser, teacher1User, teacher2User, teacher3User, ...studentUsers] = await Promise.all([
    prisma.user.create({
      data: {
        username: 'admin',
        first_name: 'Admin',
        last_name: 'User',
        phone: '+998901111111',
        password: await hashPassword('admin123'),
        role: 'ADMIN',
        status: 'active',
      },
    }),
    prisma.user.create({
      data: {
        username: 'john_doe',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+998901234567',
        password: await hashPassword('teacher123'),
        role: 'TEACHER',
        status: 'active',
      },
    }),
    prisma.user.create({
      data: {
        username: 'jane_smith',
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '+998901234568',
        password: await hashPassword('teacher123'),
        role: 'TEACHER',
        status: 'active',
      },
    }),
    prisma.user.create({
      data: {
        username: 'mike_wilson',
        first_name: 'Mike',
        last_name: 'Wilson',
        phone: '+998901234569',
        password: await hashPassword('teacher123'),
        role: 'TEACHER',
        status: 'active',
      },
    }),
    ...await Promise.all(
      Array.from({ length: 15 }, async (_, i) =>
        prisma.user.create({
          data: {
            username: `student${i + 1}`,
            first_name: `Student`,
            last_name: `${i + 1}`,
            phone: `+99890200000${String(i + 1).padStart(2, '0')}`,
            password: await hashPassword('student123'),
            role: 'STUDENT',
            status: 'active',
          },
        })
      )
    ),
  ]);

  console.log(`✅ Created ${1 + 3 + 15} users`);

  console.log('Creating teachers...');
  const [teacher1, teacher2, teacher3] = await Promise.all([
    prisma.teacher.create({
      data: {
        subject: 'Mathematics',
        user_id: teacher1User.id,
      },
    }),
    prisma.teacher.create({
      data: {
        subject: 'English Literature',
        user_id: teacher2User.id,
      },
    }),
    prisma.teacher.create({
      data: {
        subject: 'Computer Science',
        user_id: teacher3User.id,
      },
    }),
  ]);

  console.log('✅ Created 3 teachers');

  console.log('Creating students...');
  const students = await Promise.all(
    studentUsers.map((user) =>
      prisma.student.create({
        data: {
          user_id: user.id,
        },
      })
    )
  );

  console.log(`✅ Created ${students.length} students`);

  console.log('Creating courses...');
  const [mathCourse, englishCourse, csCourse, physicsCourse] = await Promise.all([
    prisma.course.create({
      data: {
        name: 'Advanced Mathematics',
        description: 'Advanced level mathematics course covering calculus, algebra, and statistics',
        duration_month: 4,
        duration_hours: 120,
        price: 500000,
        level: 'advanced',
        status: 'active',
      },
    }),
    prisma.course.create({
      data: {
        name: 'English Literature',
        description: 'Comprehensive English literature course',
        duration_month: 3,
        duration_hours: 90,
        price: 400000,
        level: 'intermediate',
        status: 'active',
      },
    }),
    prisma.course.create({
      data: {
        name: 'Web Development',
        description: 'Full-stack web development with modern technologies',
        duration_month: 5,
        duration_hours: 150,
        price: 800000,
        level: 'advanced',
        status: 'active',
      },
    }),
    prisma.course.create({
      data: {
        name: 'Physics Fundamentals',
        description: 'Basic physics principles and applications',
        duration_month: 3,
        duration_hours: 100,
        price: 450000,
        level: 'beginner',
        status: 'active',
      },
    }),
  ]);

  console.log('✅ Created 4 courses');

  console.log('Creating rooms...');
  const [room101, room102, room103, lab1] = await Promise.all([
    prisma.room.create({
      data: {
        name: 'Room 101',
        capacity: 25,
      },
    }),
    prisma.room.create({
      data: {
        name: 'Room 102',
        capacity: 30,
      },
    }),
    prisma.room.create({
      data: {
        name: 'Room 103',
        capacity: 20,
      },
    }),
    prisma.room.create({
      data: {
        name: 'Computer Lab 1',
        capacity: 15,
      },
    }),
  ]);

  console.log('✅ Created 4 rooms');

  console.log('Creating groups...');
  const [mathGroup1, mathGroup2, englishGroup, csGroup] = await Promise.all([
    prisma.group.create({
      data: {
        name: 'Math Advanced - Morning',
        status: 'active',
        course_id: mathCourse.id,
        teacher_id: teacher1.id,
        room_id: room101.id,
      },
    }),
    prisma.group.create({
      data: {
        name: 'Math Advanced - Evening',
        status: 'active',
        course_id: mathCourse.id,
        teacher_id: teacher1.id,
        room_id: room102.id,
      },
    }),
    prisma.group.create({
      data: {
        name: 'English Literature - Group A',
        status: 'active',
        course_id: englishCourse.id,
        teacher_id: teacher2.id,
        room_id: room103.id,
      },
    }),
    prisma.group.create({
      data: {
        name: 'Web Dev Bootcamp',
        status: 'active',
        course_id: csCourse.id,
        teacher_id: teacher3.id,
        room_id: lab1.id,
      },
    }),
  ]);

  console.log('✅ Created 4 groups');

  console.log('Creating student-group enrollments...');
  const enrollments: { student_id: number; group_id: number }[] = [];

  for (let i = 0; i < 5; i++) {
    enrollments.push({
      student_id: students[i].id,
      group_id: mathGroup1.id,
    });
  }

  for (let i = 5; i < 10; i++) {
    enrollments.push({
      student_id: students[i].id,
      group_id: mathGroup2.id,
    });
  }

  for (let i = 0; i < 8; i++) {
    enrollments.push({
      student_id: students[i].id,
      group_id: englishGroup.id,
    });
  }

  for (let i = 10; i < 15; i++) {
    enrollments.push({
      student_id: students[i].id,
      group_id: csGroup.id,
    });
  }

  for (let i = 10; i < 12; i++) {
    enrollments.push({
      student_id: students[i].id,
      group_id: englishGroup.id,
    });
  }

  await prisma.groupStudent.createMany({
    data: enrollments,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${enrollments.length} student-group enrollments`);

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: ${1 + 3 + 15} (1 Admin, 3 Teachers, 15 Students)`);
  console.log(`   - Teachers: 3`);
  console.log(`   - Students: ${students.length}`);
  console.log(`   - Courses: 4`);
  console.log(`   - Rooms: 4`);
  console.log(`   - Groups: 4`);
  console.log(`   - Student-Group enrollments: ${enrollments.length}`);
  console.log('\n🔑 Login credentials:');
  console.log('   Admin: +998901111111 / admin123');
  console.log('   Teacher: +998901234567 / teacher123');
  console.log('   Student: +9989020000001 / student123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
