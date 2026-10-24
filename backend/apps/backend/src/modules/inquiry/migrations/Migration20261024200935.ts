import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261024200935 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "inquiry" ("id" text not null, "type" text not null, "status" text not null default 'yeni', "name" text not null, "email" text not null, "phone" text null, "company" text null, "subject" text null, "message" text null, "data" jsonb null, "note" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "inquiry_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_inquiry_type" ON "inquiry" ("type") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_inquiry_status" ON "inquiry" ("status") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_inquiry_deleted_at" ON "inquiry" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "inquiry" cascade;`);
  }

}
