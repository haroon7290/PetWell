import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage_hero_slides" ADD COLUMN "mobile_image_id" integer;
  ALTER TABLE "homepage" ADD COLUMN "feature_banner_mobile_image_id" integer;
  ALTER TABLE "homepage" ADD COLUMN "image_banner_mobile_image_id" integer;
  ALTER TABLE "homepage_hero_slides" ADD CONSTRAINT "homepage_hero_slides_mobile_image_id_media_id_fk" FOREIGN KEY ("mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_feature_banner_mobile_image_id_media_id_fk" FOREIGN KEY ("feature_banner_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_image_banner_mobile_image_id_media_id_fk" FOREIGN KEY ("image_banner_mobile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "homepage_hero_slides_mobile_image_idx" ON "homepage_hero_slides" USING btree ("mobile_image_id");
  CREATE INDEX "homepage_feature_banner_feature_banner_mobile_image_idx" ON "homepage" USING btree ("feature_banner_mobile_image_id");
  CREATE INDEX "homepage_image_banner_image_banner_mobile_image_idx" ON "homepage" USING btree ("image_banner_mobile_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "homepage_hero_slides" DROP CONSTRAINT "homepage_hero_slides_mobile_image_id_media_id_fk";
  
  ALTER TABLE "homepage" DROP CONSTRAINT "homepage_feature_banner_mobile_image_id_media_id_fk";
  
  ALTER TABLE "homepage" DROP CONSTRAINT "homepage_image_banner_mobile_image_id_media_id_fk";
  
  DROP INDEX "homepage_hero_slides_mobile_image_idx";
  DROP INDEX "homepage_feature_banner_feature_banner_mobile_image_idx";
  DROP INDEX "homepage_image_banner_image_banner_mobile_image_idx";
  ALTER TABLE "homepage_hero_slides" DROP COLUMN "mobile_image_id";
  ALTER TABLE "homepage" DROP COLUMN "feature_banner_mobile_image_id";
  ALTER TABLE "homepage" DROP COLUMN "image_banner_mobile_image_id";`)
}
