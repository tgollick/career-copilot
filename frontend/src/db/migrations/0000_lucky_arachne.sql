CREATE TYPE "public"."company_size" AS ENUM('startup', 'small', 'medium', 'large', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."employment_type" AS ENUM('full-time', 'part-time', 'contract', 'internship');--> statement-breakpoint
CREATE TYPE "public"."experience_level" AS ENUM('entry', 'mid', 'senior', 'lead');--> statement-breakpoint
CREATE TYPE "public"."remote_type" AS ENUM('on-site', 'remote', 'hybrid');--> statement-breakpoint
CREATE TABLE "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"industry" varchar(100),
	"size" "company_size",
	"location" varchar(255),
	"website" varchar(255),
	"logo_url" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cv_analyses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_size" integer,
	"file_url" varchar(512),
	"analysis_data" json NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"linkedin" varchar(255),
	"github" varchar(255),
	"programming_languages" text[],
	"frameworks" text[],
	"databases" text[],
	"cloud_tools" text[],
	"objective" text,
	"education_summary" text,
	"experience_summary" text,
	"organizations" text[],
	"locations" text[],
	"education_level" varchar(100),
	"has_university_degree" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"analyzed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"requirements" text[],
	"skills" text[],
	"location" varchar(255),
	"remote_type" "remote_type",
	"salary_min" integer,
	"salary_max" integer,
	"salary_currency" varchar(3) DEFAULT 'GBP',
	"employment_type" "employment_type",
	"experience_level" "experience_level",
	"is_active" boolean DEFAULT true NOT NULL,
	"posted_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"active_cv_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;