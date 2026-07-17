import { sql, type Kysely } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	await sql`
        CREATE EXTENSION IF NOT EXISTS pgcrypto;
    `.execute(db);

	await db.schema
		.createTable("refresh_token")
		.addColumn("id", "uuid", col => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
		.addColumn("refresh_token_hash", "text", col => col.unique().notNull())
		.addColumn("user_id", "uuid", col => col.notNull())
		.addColumn("expires_at", "timestamptz", col => col.notNull())
		.addForeignKeyConstraint(
			"fk_refresh_token_user",
			["user_id"],
			"users",
			["id"]
		)
		.execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema
		.dropTable("refresh_token")
}
