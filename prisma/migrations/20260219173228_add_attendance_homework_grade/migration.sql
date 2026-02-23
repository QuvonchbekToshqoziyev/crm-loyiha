-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "user_id" INTEGER;

-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "attended" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "status" "Status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Homework" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lesson_id" INTEGER NOT NULL,

    CONSTRAINT "Homework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentHomeworkSubmission" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "file_url" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "homework_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,

    CONSTRAINT "StudentHomeworkSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradeStudentHomework" (
    "id" SERIAL NOT NULL,
    "grade" DECIMAL(65,30) NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "submission_id" INTEGER NOT NULL,
    "graded_by_id" INTEGER NOT NULL,

    CONSTRAINT "GradeStudentHomework_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_lesson_id_student_id_key" ON "Attendance"("lesson_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "StudentHomeworkSubmission_homework_id_student_id_key" ON "StudentHomeworkSubmission"("homework_id", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "GradeStudentHomework_submission_id_key" ON "GradeStudentHomework"("submission_id");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentHomeworkSubmission" ADD CONSTRAINT "StudentHomeworkSubmission_homework_id_fkey" FOREIGN KEY ("homework_id") REFERENCES "Homework"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentHomeworkSubmission" ADD CONSTRAINT "StudentHomeworkSubmission_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeStudentHomework" ADD CONSTRAINT "GradeStudentHomework_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "StudentHomeworkSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradeStudentHomework" ADD CONSTRAINT "GradeStudentHomework_graded_by_id_fkey" FOREIGN KEY ("graded_by_id") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
