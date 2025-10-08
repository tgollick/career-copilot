CREATE TABLE "job_similarities" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"job_id" varchar(255) NOT NULL,
	"similarity" numeric(5, 4) NOT NULL,
	"match_quality" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "job_similarities" ADD CONSTRAINT "job_similarities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_similarities" ADD CONSTRAINT "job_similarities_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_job_unique" ON "job_similarities" USING btree ("user_id","job_id");