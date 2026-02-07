const { Client } = require('pg');

async function run() {
    const c = new Client({ host: '127.0.0.1', port: 5432, user: 'tsuser', password: 'tsuser1234', database: 'tutorboard' });
    await c.connect();
    console.log('Connected to tutorboard');

    // Create enum types
    await c.query(`DO $$ BEGIN CREATE TYPE "UserRole" AS ENUM ('teacher', 'parent', 'student'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
    await c.query(`DO $$ BEGIN CREATE TYPE "SubmissionStatus" AS ENUM ('pending', 'submitted', 'graded'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
    await c.query(`DO $$ BEGIN CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'overdue'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
    await c.query(`DO $$ BEGIN CREATE TYPE "NotificationType" AS ENUM ('assignment', 'test', 'payment', 'general'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
    console.log('Enums created');

    // tb_users
    await c.query(`CREATE TABLE IF NOT EXISTS "tb_users" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "hub_user_id" INT UNIQUE,
    "username" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "role" "UserRole" NOT NULL,
    "phone" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP DEFAULT now()
  )`);
    console.log('tb_users created');

    // tb_classes
    await c.query(`CREATE TABLE IF NOT EXISTS "tb_classes" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "teacher_id" TEXT NOT NULL REFERENCES "tb_users"("id"),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "invite_code" TEXT UNIQUE NOT NULL,
    "start_date" TIMESTAMP,
    "end_date" TIMESTAMP,
    "created_at" TIMESTAMP DEFAULT now()
  )`);
    console.log('tb_classes created');

    // tb_class_enrollments
    await c.query(`CREATE TABLE IF NOT EXISTS "tb_class_enrollments" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "class_id" TEXT NOT NULL REFERENCES "tb_classes"("id"),
    "student_id" TEXT NOT NULL REFERENCES "tb_users"("id"),
    "parent_id" TEXT REFERENCES "tb_users"("id"),
    "enrolled_at" TIMESTAMP DEFAULT now(),
    UNIQUE("class_id", "student_id")
  )`);
    console.log('tb_class_enrollments created');

    // tb_lesson_plans
    await c.query(`CREATE TABLE IF NOT EXISTS "tb_lesson_plans" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "class_id" TEXT NOT NULL REFERENCES "tb_classes"("id"),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduled_date" TIMESTAMP,
    "progress" INT DEFAULT 0,
    "updated_at" TIMESTAMP DEFAULT now()
  )`);
    console.log('tb_lesson_plans created');

    // tb_assignments
    await c.query(`CREATE TABLE IF NOT EXISTS "tb_assignments" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "lesson_id" TEXT NOT NULL REFERENCES "tb_lesson_plans"("id"),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMP,
    "file_url" TEXT,
    "created_at" TIMESTAMP DEFAULT now()
  )`);
    console.log('tb_assignments created');

    // tb_assignment_submissions
    await c.query(`CREATE TABLE IF NOT EXISTS "tb_assignment_submissions" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "assignment_id" TEXT NOT NULL REFERENCES "tb_assignments"("id"),
    "student_id" TEXT NOT NULL REFERENCES "tb_users"("id"),
    "submission_file_url" TEXT,
    "feedback" TEXT,
    "grade" INT,
    "status" "SubmissionStatus" DEFAULT 'pending',
    "submitted_at" TIMESTAMP DEFAULT now(),
    UNIQUE("assignment_id", "student_id")
  )`);
    console.log('tb_assignment_submissions created');

    // tb_tests
    await c.query(`CREATE TABLE IF NOT EXISTS "tb_tests" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "lesson_id" TEXT NOT NULL REFERENCES "tb_lesson_plans"("id"),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "test_date" TIMESTAMP,
    "max_score" INT NOT NULL,
    "created_at" TIMESTAMP DEFAULT now()
  )`);
    console.log('tb_tests created');

    // tb_test_results
    await c.query(`CREATE TABLE IF NOT EXISTS "tb_test_results" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "test_id" TEXT NOT NULL REFERENCES "tb_tests"("id"),
    "student_id" TEXT NOT NULL REFERENCES "tb_users"("id"),
    "score" INT NOT NULL,
    "feedback" TEXT,
    "taken_at" TIMESTAMP DEFAULT now(),
    UNIQUE("test_id", "student_id")
  )`);
    console.log('tb_test_results created');

    // tb_payments
    await c.query(`CREATE TABLE IF NOT EXISTS "tb_payments" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "class_id" TEXT NOT NULL REFERENCES "tb_classes"("id"),
    "student_id" TEXT NOT NULL REFERENCES "tb_users"("id"),
    "amount" DECIMAL NOT NULL,
    "due_date" TIMESTAMP NOT NULL,
    "paid_date" TIMESTAMP,
    "status" "PaymentStatus" DEFAULT 'pending',
    "receipt_url" TEXT,
    "created_at" TIMESTAMP DEFAULT now()
  )`);
    console.log('tb_payments created');

    // tb_notifications
    await c.query(`CREATE TABLE IF NOT EXISTS "tb_notifications" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL REFERENCES "tb_users"("id"),
    "message" TEXT NOT NULL,
    "type" "NotificationType" DEFAULT 'general',
    "read" BOOLEAN DEFAULT false,
    "sent_at" TIMESTAMP DEFAULT now()
  )`);
    console.log('tb_notifications created');

    // tb_student_badges
    await c.query(`CREATE TABLE IF NOT EXISTS "tb_student_badges" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "student_id" TEXT NOT NULL REFERENCES "tb_users"("id"),
    "badge_type" TEXT NOT NULL,
    "badge_name" TEXT NOT NULL,
    "earned_at" TIMESTAMP DEFAULT now()
  )`);
    console.log('tb_student_badges created');

    await c.end();
    console.log('All tables created successfully!');
}

run().catch(e => console.error(e));
