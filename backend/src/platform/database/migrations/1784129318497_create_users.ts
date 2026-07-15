import { sql, type Kysely } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	await sql`
        CREATE EXTENSION IF NOT EXISTS pgcrypto;
    `.execute(db);

	await db.schema
		.createTable("users")
		.addColumn("id", "uuid", col => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
		.addColumn("name", "varchar(64)")
		.addColumn("email", "varchar(320)", col => col.unique())
		.addColumn("password_hash", "text")
		.execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema
		.dropTable("users")
		.execute();
}
