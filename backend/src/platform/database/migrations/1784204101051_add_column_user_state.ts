import { sql, type Kysely } from 'kysely'

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createType("user_state_enum")
		.asEnum(["VERIFICATION_PENDING", "ACTIVE", "BLOCKED"])
		.execute();

	await db.schema
		.alterTable("users")
		.addColumn("state", sql`user_state_enum`, col => col.notNull().defaultTo("VERIFICATION_PENDING"))
		.execute();
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable("users")
		.dropColumn("state")
		.execute();

	await db.schema
		.dropType("user_state_enum")
		.execute();
}
