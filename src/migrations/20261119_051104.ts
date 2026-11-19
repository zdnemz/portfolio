import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_status" AS ENUM('shipped', 'in-progress', 'archived');
  CREATE TYPE "public"."enum_site_about_groups_span" AS ENUM('3', '4', '2');
  CREATE TYPE "public"."enum_site_now_items_kind" AS ENUM('text', 'clock');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "projects_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"summary" varchar,
  	"problem" varchar,
  	"role" varchar,
  	"outcome" varchar,
  	"outcome_metric_value" numeric,
  	"outcome_metric_unit" varchar,
  	"timeline" varchar,
  	"client" varchar,
  	"status" "enum_projects_status" DEFAULT 'shipped',
  	"project_type" varchar,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"featured" boolean DEFAULT false,
  	"project_url" varchar,
  	"repository_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"external_url" varchar,
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "contact_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"read" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"projects_id" integer,
  	"media_id" integer,
  	"contact_submissions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_hero_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "site_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "site_services_items_tools" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "site_services_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "site_process_items_tools" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "site_process_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "site_about_groups_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "site_about_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"span" "enum_site_about_groups_span" DEFAULT '3'
  );
  
  CREATE TABLE "site_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"role" varchar,
  	"company" varchar
  );
  
  CREATE TABLE "site_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "site_now_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"kind" "enum_site_now_items_kind" DEFAULT 'text'
  );
  
  CREATE TABLE "site_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "site_footer_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "site" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_keywords" varchar,
  	"seo_og_image_url" varchar,
  	"identity_name" varchar,
  	"identity_role" varchar,
  	"identity_tagline" varchar,
  	"identity_location" varchar,
  	"identity_timezone" varchar,
  	"identity_email" varchar,
  	"identity_availability_label" varchar,
  	"identity_available" boolean DEFAULT true,
  	"identity_local_time_zone" varchar,
  	"identity_cv_url" varchar,
  	"identity_initials" varchar,
  	"identity_wordmark" varchar,
  	"identity_wordmark_accent" varchar,
  	"hero_eyebrow" varchar,
  	"hero_headline" varchar,
  	"hero_headline_accent" varchar,
  	"hero_intro" varchar,
  	"hero_primary_cta" varchar,
  	"hero_secondary_cta" varchar,
  	"stats_eyebrow" varchar,
  	"stats_note" varchar,
  	"projects_section_eyebrow" varchar,
  	"projects_section_heading" varchar,
  	"projects_section_browse_label" varchar,
  	"projects_section_empty_message" varchar,
  	"projects_section_error_message" varchar,
  	"projects_section_in_progress_label" varchar,
  	"services_eyebrow" varchar,
  	"services_heading" varchar,
  	"services_intro" varchar,
  	"process_eyebrow" varchar,
  	"process_heading" varchar,
  	"about_eyebrow" varchar,
  	"about_heading" varchar,
  	"about_bio" varchar,
  	"about_stack_eyebrow" varchar,
  	"about_stack_note" varchar,
  	"testimonials_eyebrow" varchar,
  	"testimonials_heading" varchar,
  	"github_eyebrow" varchar,
  	"github_heading" varchar,
  	"github_profile_label" varchar,
  	"github_profile_url" varchar,
  	"github_empty_message" varchar,
  	"faq_eyebrow" varchar,
  	"faq_heading" varchar,
  	"faq_intro" varchar,
  	"faq_contact_prompt" varchar,
  	"now_eyebrow" varchar,
  	"contact_eyebrow" varchar,
  	"contact_heading" varchar,
  	"contact_intro" varchar,
  	"contact_email_label" varchar,
  	"contact_email" varchar,
  	"contact_form_eyebrow" varchar,
  	"contact_name_label" varchar,
  	"contact_name_placeholder" varchar,
  	"contact_email_field_label" varchar,
  	"contact_email_placeholder" varchar,
  	"contact_message_label" varchar,
  	"contact_message_placeholder" varchar,
  	"contact_submit_label" varchar,
  	"contact_sending_label" varchar,
  	"contact_success_message" varchar,
  	"contact_error_message" varchar,
  	"contact_cv_label" varchar,
  	"contact_cv_note" varchar,
  	"footer_copyright" varchar,
  	"project_page_back_label" varchar,
  	"project_page_archive_eyebrow" varchar,
  	"project_page_archive_heading" varchar,
  	"project_page_archive_intro" varchar,
  	"project_page_print_label" varchar,
  	"project_page_empty_message" varchar,
  	"project_page_problem_label" varchar,
  	"project_page_role_label" varchar,
  	"project_page_outcome_label" varchar,
  	"project_page_timeline_label" varchar,
  	"project_page_stack_label" varchar,
  	"project_page_live_label" varchar,
  	"project_page_code_label" varchar,
  	"project_page_gallery_empty" varchar,
  	"project_page_meta_client_label" varchar,
  	"project_page_meta_type_label" varchar,
  	"project_page_meta_status_label" varchar,
  	"project_page_back_to_projects_label" varchar,
  	"projects_print_eyebrow" varchar,
  	"projects_print_headline" varchar,
  	"projects_print_profile_heading" varchar,
  	"projects_print_stack_heading" varchar,
  	"projects_print_work_heading" varchar,
  	"projects_print_footer_note" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_stack" ADD CONSTRAINT "projects_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_hero_marquee" ADD CONSTRAINT "site_hero_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_stats_items" ADD CONSTRAINT "site_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_services_items_tools" ADD CONSTRAINT "site_services_items_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_services_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_services_items" ADD CONSTRAINT "site_services_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_process_items_tools" ADD CONSTRAINT "site_process_items_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_process_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_process_items" ADD CONSTRAINT "site_process_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_about_groups_items" ADD CONSTRAINT "site_about_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_about_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_about_groups" ADD CONSTRAINT "site_about_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_testimonials_items" ADD CONSTRAINT "site_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_faq_items" ADD CONSTRAINT "site_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_now_items" ADD CONSTRAINT "site_now_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_nav_items" ADD CONSTRAINT "site_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_footer_socials" ADD CONSTRAINT "site_footer_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "projects_stack_order_idx" ON "projects_stack" USING btree ("_order");
  CREATE INDEX "projects_stack_parent_id_idx" ON "projects_stack" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_media_id_idx" ON "projects_rels" USING btree ("media_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_hero_marquee_order_idx" ON "site_hero_marquee" USING btree ("_order");
  CREATE INDEX "site_hero_marquee_parent_id_idx" ON "site_hero_marquee" USING btree ("_parent_id");
  CREATE INDEX "site_stats_items_order_idx" ON "site_stats_items" USING btree ("_order");
  CREATE INDEX "site_stats_items_parent_id_idx" ON "site_stats_items" USING btree ("_parent_id");
  CREATE INDEX "site_services_items_tools_order_idx" ON "site_services_items_tools" USING btree ("_order");
  CREATE INDEX "site_services_items_tools_parent_id_idx" ON "site_services_items_tools" USING btree ("_parent_id");
  CREATE INDEX "site_services_items_order_idx" ON "site_services_items" USING btree ("_order");
  CREATE INDEX "site_services_items_parent_id_idx" ON "site_services_items" USING btree ("_parent_id");
  CREATE INDEX "site_process_items_tools_order_idx" ON "site_process_items_tools" USING btree ("_order");
  CREATE INDEX "site_process_items_tools_parent_id_idx" ON "site_process_items_tools" USING btree ("_parent_id");
  CREATE INDEX "site_process_items_order_idx" ON "site_process_items" USING btree ("_order");
  CREATE INDEX "site_process_items_parent_id_idx" ON "site_process_items" USING btree ("_parent_id");
  CREATE INDEX "site_about_groups_items_order_idx" ON "site_about_groups_items" USING btree ("_order");
  CREATE INDEX "site_about_groups_items_parent_id_idx" ON "site_about_groups_items" USING btree ("_parent_id");
  CREATE INDEX "site_about_groups_order_idx" ON "site_about_groups" USING btree ("_order");
  CREATE INDEX "site_about_groups_parent_id_idx" ON "site_about_groups" USING btree ("_parent_id");
  CREATE INDEX "site_testimonials_items_order_idx" ON "site_testimonials_items" USING btree ("_order");
  CREATE INDEX "site_testimonials_items_parent_id_idx" ON "site_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "site_faq_items_order_idx" ON "site_faq_items" USING btree ("_order");
  CREATE INDEX "site_faq_items_parent_id_idx" ON "site_faq_items" USING btree ("_parent_id");
  CREATE INDEX "site_now_items_order_idx" ON "site_now_items" USING btree ("_order");
  CREATE INDEX "site_now_items_parent_id_idx" ON "site_now_items" USING btree ("_parent_id");
  CREATE INDEX "site_nav_items_order_idx" ON "site_nav_items" USING btree ("_order");
  CREATE INDEX "site_nav_items_parent_id_idx" ON "site_nav_items" USING btree ("_parent_id");
  CREATE INDEX "site_footer_socials_order_idx" ON "site_footer_socials" USING btree ("_order");
  CREATE INDEX "site_footer_socials_parent_id_idx" ON "site_footer_socials" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "projects_stack" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_hero_marquee" CASCADE;
  DROP TABLE "site_stats_items" CASCADE;
  DROP TABLE "site_services_items_tools" CASCADE;
  DROP TABLE "site_services_items" CASCADE;
  DROP TABLE "site_process_items_tools" CASCADE;
  DROP TABLE "site_process_items" CASCADE;
  DROP TABLE "site_about_groups_items" CASCADE;
  DROP TABLE "site_about_groups" CASCADE;
  DROP TABLE "site_testimonials_items" CASCADE;
  DROP TABLE "site_faq_items" CASCADE;
  DROP TABLE "site_now_items" CASCADE;
  DROP TABLE "site_nav_items" CASCADE;
  DROP TABLE "site_footer_socials" CASCADE;
  DROP TABLE "site" CASCADE;
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum_site_about_groups_span";
  DROP TYPE "public"."enum_site_now_items_kind";`)
}
