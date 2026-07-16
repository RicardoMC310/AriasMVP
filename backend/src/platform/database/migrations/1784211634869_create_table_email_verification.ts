import { sql, type Kysely } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	await sql`
			CREATE EXTENSION IF NOT EXISTS pgcrypto;
		`.execute(db);

	await db.schema
		.createTable("email_verification")
		.addColumn("id", "uuid", col => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
		.addColumn("user_id", "uuid", col => col.unique().notNull())
		.addColumn("code_hash", "text", col => col.unique().notNull())
		.addColumn("expiresAt", "timestamptz", col => col.notNull())
		.addColumn("verified", "boolean", col => col.defaultTo(false))
		.addColumn("attempts", "integer", col => col.defaultTo(0).notNull())
		.addForeignKeyConstraint(
			"fk_email_verification_user",
			["user_id"],
			"users",
			["id"]
		)
		.addCheckConstraint(
			"attempts_non_negative",
			sql`attempts >= 0`
		)
		.execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema
		.dropTable("email_verification")
		.execute();
}
