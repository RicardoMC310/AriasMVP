import { Kysely } from "kysely";
import KyselyEmailVerificationRepository from "../../../modules/email-verification/infrastructure/database/kysely.infra.js";
import { DB } from "../../../platform/database/db.js";

export default function kyselyEmailVerificationRepositoryFactory(db: Kysely<DB>) {
    return new KyselyEmailVerificationRepository(db);
}