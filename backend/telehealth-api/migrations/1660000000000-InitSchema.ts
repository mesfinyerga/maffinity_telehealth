import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1660000000000 implements MigrationInterface {
  name = 'InitSchema1660000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "user_role_enum" AS ENUM('patient','doctor','admin')`);
    await queryRunner.query(`CREATE TYPE "gender_type_enum" AS ENUM('male','female','other','prefer_not_to_say')`);
    await queryRunner.query(`CREATE TYPE "language_type_enum" AS ENUM('english','amharic')`);

    await queryRunner.query(`CREATE TABLE "users" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "email" varchar NOT NULL UNIQUE,
      "phone" varchar UNIQUE,
      "password_hash" varchar NOT NULL,
      "role" "user_role_enum" NOT NULL DEFAULT 'patient',
      "first_name" varchar NOT NULL,
      "last_name" varchar NOT NULL,
      "date_of_birth" date,
      "gender" "gender_type_enum",
      "preferred_language" "language_type_enum" NOT NULL DEFAULT 'english',
      "is_active" boolean NOT NULL DEFAULT true,
      "email_verified" boolean NOT NULL DEFAULT false,
      "phone_verified" boolean NOT NULL DEFAULT false,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      "last_login" TIMESTAMP
    )`);

    await queryRunner.query(`CREATE TABLE "patient_profiles" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" uuid NOT NULL UNIQUE,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "FK_patient_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);

    await queryRunner.query(`CREATE TABLE "doctor_profiles" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" uuid NOT NULL UNIQUE,
      "license_number" varchar NOT NULL UNIQUE,
      "specialization" varchar NOT NULL,
      "is_verified" boolean NOT NULL DEFAULT false,
      "is_available" boolean NOT NULL DEFAULT true,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "FK_doctor_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "doctor_profiles"`);
    await queryRunner.query(`DROP TABLE "patient_profiles"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "language_type_enum"`);
    await queryRunner.query(`DROP TYPE "gender_type_enum"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}
