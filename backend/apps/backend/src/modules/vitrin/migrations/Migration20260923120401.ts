import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260923120401 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "vitrin_list" drop constraint if exists "vitrin_list_key_unique";`);
    this.addSql(`create table if not exists "vitrin_block" ("id" text not null, "group" text not null, "key" text null, "rank" integer not null default 0, "is_active" boolean not null default true, "data" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vitrin_block_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vitrin_block_group" ON "vitrin_block" ("group") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vitrin_block_deleted_at" ON "vitrin_block" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "vitrin_list" ("id" text not null, "key" text not null, "title" text not null, "description" text null, "product_ids" text[] not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "vitrin_list_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_vitrin_list_key_unique" ON "vitrin_list" ("key") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_vitrin_list_deleted_at" ON "vitrin_list" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "vitrin_block" cascade;`);

    this.addSql(`drop table if exists "vitrin_list" cascade;`);
  }

}
